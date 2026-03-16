import unittest
from unittest.mock import patch
from app import create_app
from app.extensions import limiter

class SecurityTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['WTF_CSRF_ENABLED'] = False
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        
        # Try to reset limiter
        # Note: In Flask-Limiter v3, resetting might depend on storage
        # Ideally we use a fresh storage or unique key
        pass

    def tearDown(self):
        self.ctx.pop()

    def test_input_validation_special_chars(self):
        """Test input validation for special characters."""
        chars = ['<', '>', '"', "'", '&', '%', '*', ';']
        for char in chars:
            # We use query_string to ensure special chars are properly encoded in the URL
            # otherwise '&' acts as a delimiter and isn't part of the value
            response = self.client.get('/weather/uv', query_string={'q': f'city{char}'})
            self.assertEqual(response.status_code, 400, f"Failed to block char: {char}")
            data = response.get_json()
            self.assertIn("forbidden characters", data['details'])

    def test_input_validation_length(self):
        """Test input validation for length limit."""
        long_str = "a" * 51
        response = self.client.get(f'/weather/uv?q={long_str}')
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn("exceeds 50 characters", data['details'])

    @patch('app.blueprints.main.routes.requests.get')
    def test_rate_limiting(self, mock_get):
        """Test rate limiting 50/second."""
        # Mock external API to return success so we don't hit network and keep it fast
        mock_get.return_value.status_code = 200
        # Minimal mock response structure to pass the route logic
        mock_get.return_value.json.return_value = {
            "name": "Test City",
            "main": {"temp": 20},
            "sys": {"sunrise": 0, "sunset": 0},
            "weather": [{"main": "Clear"}],
            "current": {"uv_index": 5}
        }
        
        # Use a unique IP for this test to avoid conflicts with other tests or previous runs
        # Flask-Limiter uses request.remote_addr by default
        ip = '127.0.0.100'
        
        # Send 50 requests
        for i in range(50):
            response = self.client.get('/weather/uv?lat=0&lon=0', environ_base={'REMOTE_ADDR': ip})
            # Should NOT be 429
            self.assertNotEqual(response.status_code, 429, f"Request {i+1} was rate limited unexpectedly")
        
        # 51st request should be blocked
        response = self.client.get('/weather/uv?lat=0&lon=0', environ_base={'REMOTE_ADDR': ip})
        self.assertEqual(response.status_code, 429, "Rate limit did not trigger on 51st request")
