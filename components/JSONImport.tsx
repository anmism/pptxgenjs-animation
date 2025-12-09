// components/JSONImport.tsx
"use client";

import { useState } from "react";
import { Upload, FileJson, Download, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { JSONImportService } from "@/services/jsonImportService";
import { JSONPresentation } from "../json-import";

export default function JSONImport() {
  const [jsonData, setJsonData] = useState<JSONPresentation | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const validation = JSONImportService.validateJSON(json);
      
      if (!validation.valid) {
        setErrors(validation.errors);
        setJsonData(null);
        return;
      }

      setJsonData(json);
      setGeneratedCode(JSONImportService.generateCodeFromJSON(json));
    } catch (error) {
      setErrors([`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      setJsonData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGeneratePPTX = async () => {
    if (!jsonData) return;

    setIsProcessing(true);
    try {
      await JSONImportService.generatePPTXFromJSON(
        jsonData,
        jsonData.title ? `${jsonData.title}.pptx` : "imported-presentation.pptx"
      );
    } catch (error) {
      setErrors([`Failed to generate PPTX: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-blue-600" />
            Import from JSON
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Upload a JSON file to generate a PowerPoint presentation
          </p>
        </div>
      </div>

      {/* File Upload */}
      <div className="relative">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
          id="json-upload"
          disabled={isProcessing}
        />
        <label
          htmlFor="json-upload"
          className={`
            flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'}
            ${jsonData ? 'border-green-400 bg-green-50' : 'border-slate-300'}
          `}
        >
          <Upload className="w-5 h-5" />
          <span className="text-sm font-medium">
            {jsonData ? 'JSON Loaded - Click to upload another' : 'Click to upload JSON file'}
          </span>
        </label>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">Validation Errors:</div>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* JSON Info */}
      {jsonData && errors.length === 0 && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-600 font-medium">Title:</span>
              <span className="ml-2 text-slate-900">{jsonData.title || 'Untitled'}</span>
            </div>
            <div>
              <span className="text-slate-600 font-medium">Slides:</span>
              <span className="ml-2 text-slate-900">{jsonData.slides.length}</span>
            </div>
            {jsonData.author && (
              <div>
                <span className="text-slate-600 font-medium">Author:</span>
                <span className="ml-2 text-slate-900">{jsonData.author}</span>
              </div>
            )}
            {jsonData.company && (
              <div>
                <span className="text-slate-600 font-medium">Company:</span>
                <span className="ml-2 text-slate-900">{jsonData.company}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {jsonData && errors.length === 0 && (
        <div className="flex gap-2">
          <Button
            onClick={handleGeneratePPTX}
            disabled={isProcessing}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {isProcessing ? 'Generating...' : 'Generate PPTX'}
          </Button>
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide' : 'Show'} Code
          </Button>
        </div>
      )}

      {/* Code Preview */}
      {showPreview && generatedCode && (
        <div className="mt-4 bg-slate-900 text-slate-200 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
            <span className="text-sm font-semibold">Generated Code Preview</span>
          </div>
          <pre className="p-4 overflow-x-auto text-xs leading-relaxed max-h-96">
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
}