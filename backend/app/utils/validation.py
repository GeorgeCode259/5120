import re
from functools import wraps
from flask import request, jsonify

def validate_input(f):
    """
    Decorator to validate input parameters for security.
    Checks for:
    1. Forbidden characters: < > " ' & % * ;
    2. Maximum length: 50 characters
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Define forbidden patterns
        # < > " ' & % * ;
        # Note: \ needs to be escaped in regex string if we want to match backslash, 
        # but the prompt said "ban ... \" ...". It probably means double quote.
        # Prompt: prohibiting < > \ " ' & % * ;
        # So it bans backslash too.
        # Regex for [ < > \ " ' & % * ; ]
        # Inside [] we need to escape \ and " and ' if needed.
        forbidden_pattern = re.compile(r'[<>\\"\'&%*;]')
        
        # Check query parameters (request.args)
        for key, value in request.args.items():
            # Value is always a string in request.args
            
            # Length check
            if len(value) > 50:
                return jsonify({
                    "error": "Input validation failed",
                    "details": f"Parameter '{key}' exceeds 50 characters limit."
                }), 400
            
            # Forbidden characters check
            if forbidden_pattern.search(value):
                return jsonify({
                    "error": "Input validation failed",
                    "details": f"Parameter '{key}' contains forbidden characters."
                }), 400

        return f(*args, **kwargs)
    return decorated_function
