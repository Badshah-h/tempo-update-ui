<?php

namespace App\Services;

use App\Models\RoutingRule;
use App\Models\AIModel;
use Illuminate\Database\Eloquent\Collection;

class RoutingService
{
    /**
     * Get all routing rules.
     *
     * @param bool $activeOnly
     * @return Collection
     */
    public function getAllRules(bool $activeOnly = false): Collection
    {
        $query = RoutingRule::with('targetModel.provider');
        
        if ($activeOnly) {
            $query->where('is_active', true);
        }
        
        return $query->orderBy('priority', 'desc')->get();
    }
    
    /**
     * Get a rule by ID.
     *
     * @param int $id
     * @return RoutingRule|null
     */
    public function getRuleById(int $id): ?RoutingRule
    {
        return RoutingRule::with('targetModel.provider')->find($id);
    }
    
    /**
     * Create a new routing rule.
     *
     * @param array $data
     * @return RoutingRule
     */
    public function createRule(array $data): RoutingRule
    {
        return RoutingRule::create($data);
    }
    
    /**
     * Update a routing rule.
     *
     * @param int $id
     * @param array $data
     * @return RoutingRule|null
     */
    public function updateRule(int $id, array $data): ?RoutingRule
    {
        $rule = $this->getRuleById($id);
        
        if (!$rule) {
            return null;
        }
        
        $rule->update($data);
        return $rule;
    }
    
    /**
     * Delete a routing rule.
     *
     * @param int $id
     * @return bool
     */
    public function deleteRule(int $id): bool
    {
        $rule = $this->getRuleById($id);
        
        if (!$rule) {
            return false;
        }
        
        return $rule->delete();
    }
    
    /**
     * Toggle the active status of a rule.
     *
     * @param int $id
     * @return RoutingRule|null
     */
    public function toggleRuleStatus(int $id): ?RoutingRule
    {
        $rule = $this->getRuleById($id);
        
        if (!$rule) {
            return null;
        }
        
        $rule->is_active = !$rule->is_active;
        $rule->save();
        
        return $rule;
    }
    
    /**
     * Update rule priorities.
     *
     * @param array $ruleIds Ordered array of rule IDs
     * @return bool
     */
    public function updateRulePriorities(array $ruleIds): bool
    {
        $priority = count($ruleIds);
        
        foreach ($ruleIds as $ruleId) {
            $rule = RoutingRule::find($ruleId);
            
            if ($rule) {
                $rule->priority = $priority--;
                $rule->save();
            }
        }
        
        return true;
    }
    
    /**
     * Route a message to the appropriate AI model.
     *
     * @param string $message
     * @param array $context
     * @return array
     */
    public function routeMessage(string $message, array $context = []): array
    {
        // Get active rules ordered by priority
        $rules = RoutingRule::active()->byPriority()->with('targetModel.provider')->get();
        
        foreach ($rules as $rule) {
            if ($this->evaluateRule($rule, $message, $context)) {
                $model = $rule->targetModel;
                
                if ($model && $model->is_active && $model->provider && $model->provider->is_active) {
                    return [
                        'model_id' => $model->id,
                        'rule_id' => $rule->id,
                        'confidence' => 1.0,
                        'fallback' => false,
                    ];
                }
            }
        }
        
        // No matching rule, use default model
        $defaultModel = AIModel::active()->default()->with('provider')->first();
        
        if ($defaultModel && $defaultModel->provider && $defaultModel->provider->is_active) {
            return [
                'model_id' => $defaultModel->id,
                'rule_id' => null,
                'confidence' => 0.5,
                'fallback' => true,
            ];
        }
        
        // No default model, use any active model
        $anyModel = AIModel::active()->with('provider')->first();
        
        if ($anyModel && $anyModel->provider && $anyModel->provider->is_active) {
            return [
                'model_id' => $anyModel->id,
                'rule_id' => null,
                'confidence' => 0.3,
                'fallback' => true,
            ];
        }
        
        return [
            'model_id' => null,
            'rule_id' => null,
            'confidence' => 0,
            'fallback' => true,
        ];
    }
    
    /**
     * Evaluate if a rule applies to a message.
     *
     * @param RoutingRule $rule
     * @param string $message
     * @param array $context
     * @return bool
     */
    private function evaluateRule(RoutingRule $rule, string $message, array $context = []): bool
    {
        $conditions = $rule->conditions;
        
        if (empty($conditions)) {
            return false;
        }
        
        // All conditions must match
        foreach ($conditions as $condition) {
            if (!$this->evaluateCondition($condition, $message, $context)) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Evaluate a single condition.
     *
     * @param array $condition
     * @param string $message
     * @param array $context
     * @return bool
     */
    private function evaluateCondition(array $condition, string $message, array $context = []): bool
    {
        if (!isset($condition['type']) || !isset($condition['operator']) || !isset($condition['value'])) {
            return false;
        }
        
        switch ($condition['type']) {
            case 'keyword':
                return $this->evaluateKeywordCondition($condition, $message);
                
            case 'length':
                return $this->evaluateLengthCondition($condition, $message);
                
            case 'language':
                $language = $context['language'] ?? 'en';
                return $this->evaluateLanguageCondition($condition, $language);
                
            case 'custom':
                if (isset($condition['field']) && isset($context[$condition['field']])) {
                    return $this->evaluateCustomCondition($condition, $context[$condition['field']]);
                }
                return false;
                
            default:
                return false;
        }
    }
    
    /**
     * Evaluate a keyword condition.
     *
     * @param array $condition
     * @param string $text
     * @return bool
     */
    private function evaluateKeywordCondition(array $condition, string $text): bool
    {
        $normalizedText = mb_strtolower($text);
        $value = mb_strtolower((string) $condition['value']);
        
        switch ($condition['operator']) {
            case 'contains':
                return str_contains($normalizedText, $value);
                
            case 'not_contains':
                return !str_contains($normalizedText, $value);
                
            case 'equals':
                return $normalizedText === $value;
                
            case 'not_equals':
                return $normalizedText !== $value;
                
            case 'starts_with':
                return str_starts_with($normalizedText, $value);
                
            case 'ends_with':
                return str_ends_with($normalizedText, $value);
                
            case 'matches_regex':
                return (bool) preg_match('/' . $value . '/i', $normalizedText);
                
            default:
                return false;
        }
    }
    
    /**
     * Evaluate a length condition.
     *
     * @param array $condition
     * @param string $text
     * @return bool
     */
    private function evaluateLengthCondition(array $condition, string $text): bool
    {
        $length = mb_strlen($text);
        $value = (int) $condition['value'];
        
        switch ($condition['operator']) {
            case 'equals':
                return $length === $value;
                
            case 'not_equals':
                return $length !== $value;
                
            case 'greater_than':
                return $length > $value;
                
            case 'less_than':
                return $length < $value;
                
            case 'greater_than_or_equals':
                return $length >= $value;
                
            case 'less_than_or_equals':
                return $length <= $value;
                
            default:
                return false;
        }
    }
    
    /**
     * Evaluate a language condition.
     *
     * @param array $condition
     * @param string $language
     * @return bool
     */
    private function evaluateLanguageCondition(array $condition, string $language): bool
    {
        $normalizedLanguage = mb_strtolower($language);
        $value = mb_strtolower((string) $condition['value']);
        
        switch ($condition['operator']) {
            case 'equals':
                return $normalizedLanguage === $value;
                
            case 'not_equals':
                return $normalizedLanguage !== $value;
                
            case 'contains':
                return str_contains($normalizedLanguage, $value);
                
            case 'not_contains':
                return !str_contains($normalizedLanguage, $value);
                
            default:
                return false;
        }
    }
    
    /**
     * Evaluate a custom condition.
     *
     * @param array $condition
     * @param mixed $value
     * @return bool
     */
    private function evaluateCustomCondition(array $condition, $fieldValue): bool
    {
        $conditionValue = $condition['value'];
        
        switch ($condition['operator']) {
            case 'equals':
                return $fieldValue == $conditionValue;
                
            case 'not_equals':
                return $fieldValue != $conditionValue;
                
            case 'contains':
                return is_string($fieldValue) && str_contains($fieldValue, (string) $conditionValue);
                
            case 'not_contains':
                return is_string($fieldValue) && !str_contains($fieldValue, (string) $conditionValue);
                
            case 'greater_than':
                return is_numeric($fieldValue) && $fieldValue > $conditionValue;
                
            case 'less_than':
                return is_numeric($fieldValue) && $fieldValue < $conditionValue;
                
            case 'greater_than_or_equals':
                return is_numeric($fieldValue) && $fieldValue >= $conditionValue;
                
            case 'less_than_or_equals':
                return is_numeric($fieldValue) && $fieldValue <= $conditionValue;
                
            default:
                return false;
        }
    }
    
    /**
     * Test a rule against a message.
     *
     * @param int $ruleId
     * @param string $message
     * @param array $context
     * @return array
     */
    public function testRule(int $ruleId, string $message, array $context = []): array
    {
        $rule = $this->getRuleById($ruleId);
        
        if (!$rule) {
            return [
                'matches' => false,
                'message' => 'Rule not found',
            ];
        }
        
        $matches = $this->evaluateRule($rule, $message, $context);
        
        return [
            'matches' => $matches,
            'rule' => $rule->toArray(),
            'target_model' => $rule->targetModel ? $rule->targetModel->toArray() : null,
        ];
    }
}