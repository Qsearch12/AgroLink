import os
import json
import google.generativeai as genai
from typing import Dict, Any
from app.core.config import settings

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    async def get_crop_recommendation(self, soil_type: str, location: str, farm_size: float) -> Dict[str, Any]:
        if not self.model:
            # Fallback for when API key is not provided during development
            return self._get_fallback_recommendation(soil_type)

        prompt = f"""
        Act as a professional agricultural expert. Provide a crop recommendation for a farm with the following details:
        Soil Type: {soil_type}
        Location: {location}
        Farm Size: {farm_size} hectares

        Return the response strictly in JSON format with exactly these keys:
        - recommended_crop: (The recommended crop name)
        - expected_yield: (Expected yield per hectare with units)
        - optimal_planting_time: (Best months to plant)
        - confidence_score: (A float between 0 and 1)
        - rationale: (A detailed explanation, growing tips, and advice)
        """

        try:
            response = self.model.generate_content(prompt)
            text = response.text
            # More robust JSON extraction
            import re
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
            else:
                raise ValueError("No JSON found in response")
            
            return {
                "recommended_crop": str(data.get("recommended_crop", "Unknown Crop")),
                "expected_yield": str(data.get("expected_yield", "N/A")),
                "optimal_planting_time": str(data.get("optimal_planting_time", "N/A")),
                "confidence_score": float(data.get("confidence_score", 0.8)),
                "rationale": str(data.get("rationale", "No analysis provided."))
            }
        except Exception as e:
            print(f"AI Error: {e}")
            return self._get_fallback_recommendation(soil_type)

    def _get_fallback_recommendation(self, soil_type: str) -> Dict[str, Any]:
        crops = {
            "Sandy": "Watermelon or Peanuts",
            "Clay": "Rice or Cabbage",
            "Loamy": "Maize, Tomatoes, or Beans",
            "Silt": "Wheat or Lettuce",
            "Peat": "Potatoes or Blueberries",
            "Chalky": "Spinach or Lavender"
        }
        recommended = crops.get(soil_type, "Maize")
        return {
            "recommended_crop": recommended,
            "expected_yield": "3.5 tons per hectare",
            "optimal_planting_time": "April – June",
            "confidence_score": 0.85,
            "rationale": f"Based on your {soil_type} soil, {recommended} is the ideal choice. \n\nTips:\n1. Ensure consistent irrigation during the first 4 weeks.\n2. Apply organic fertilizer 2 weeks before planting.\n3. Monitor for common pests like aphids during the flowering stage.\n\nThis crop thrives in your location's climate and will provide optimal returns for a farm of your size."
        }

ai_service = AIService()
