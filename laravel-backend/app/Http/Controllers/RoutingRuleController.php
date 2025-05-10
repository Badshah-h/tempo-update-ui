<?php

namespace App\Http\Controllers;

use App\Models\RoutingRule;
use App\Services\RoutingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoutingRuleController extends Controller
{
    protected $routingService;
    
    public function __construct(RoutingService $routingService)
    {
        $this->routingService = $routingService;
    }
    
    /**
     * Get all routing rules.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $activeOnly = $request->query('active_only', false);
        $rules = $this->routingService->getAllRules($activeOnly);
        
        return response()->json([
            'status' => 'success',
            'data' => $rules,
        ]);
    }
    
    /**
     * Get a specific routing rule.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $rule = $this->routingService->getRuleById($id);
        
        if (!$rule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Routing rule not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $rule,
        ]);
    }
    
    /**
     * Create a new routing rule.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'priority' => 'nullable|integer',
            'conditions' => 'required|array',
            'target_model_id' => 'required|exists:ai_models,id',
            'is_active' => 'nullable|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $rule = $this->routingService->createRule($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Routing rule created successfully',
            'data' => $rule,
        ], 201);
    }
    
    /**
     * Update a routing rule.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'priority' => 'nullable|integer',
            'conditions' => 'nullable|array',
            'target_model_id' => 'nullable|exists:ai_models,id',
            'is_active' => 'nullable|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $rule = $this->routingService->updateRule($id, $request->all());
        
        if (!$rule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Routing rule not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Routing rule updated successfully',
            'data' => $rule,
        ]);
    }
    
    /**
     * Delete a routing rule.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $result = $this->routingService->deleteRule($id);
        
        if (!$result) {
            return response()->json([
                'status' => 'error',
                'message' => 'Routing rule not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Routing rule deleted successfully',
        ]);
    }
    
    /**
     * Toggle the active status of a routing rule.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleStatus($id)
    {
        $rule = $this->routingService->toggleRuleStatus($id);
        
        if (!$rule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Routing rule not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Routing rule status updated successfully',
            'data' => $rule,
        ]);
    }
    
    /**
     * Update rule priorities.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePriorities(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rule_ids' => 'required|array',
            'rule_ids.*' => 'required|exists:routing_rules,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $result = $this->routingService->updateRulePriorities($request->rule_ids);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Rule priorities updated successfully',
        ]);
    }
    
    /**
     * Test a rule against a message.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function testRule(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string',
            'context' => 'nullable|array',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $result = $this->routingService->testRule(
            $id,
            $request->message,
            $request->context ?? []
        );
        
        return response()->json([
            'status' => 'success',
            'data' => $result,
        ]);
    }
    
    /**
     * Route a message to the appropriate AI model.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function routeMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string',
            'context' => 'nullable|array',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $result = $this->routingService->routeMessage(
            $request->message,
            $request->context ?? []
        );
        
        return response()->json([
            'status' => 'success',
            'data' => $result,
        ]);
    }
}