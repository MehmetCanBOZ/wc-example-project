import { expect } from '@open-wc/testing';
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
} from '../../src/utils/security.js';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const result = sanitizeInput(input);
      expect(result).to.equal('Hello  World');
    });

    it('should remove HTML tags', () => {
      const input = 'Hello <b>World</b>';
      const result = sanitizeInput(input);
      expect(result).to.equal('Hello World');
    });

    it('should remove javascript protocol', () => {
      const dangerousProtocol = 'javascript';
      const input = `${dangerousProtocol}:alert("xss")`;
      const result = sanitizeInput(input);
      expect(result).to.equal('alert("xss")');
    });

    it('should remove event handlers', () => {
      const input = 'Hello onclick=alert("xss") World';
      const result = sanitizeInput(input);
      expect(result).to.equal('Hello alert("xss") World');
    });
  });

  describe('sanitizeEmail', () => {
    it('should sanitize email input', () => {
      const input = 'Test@Example.COM<script>';
      const result = sanitizeEmail(input);
      expect(result).to.equal('test@example.comscript');
    });

    it('should handle normal email', () => {
      const input = 'user@example.com';
      const result = sanitizeEmail(input);
      expect(result).to.equal('user@example.com');
    });
  });

  describe('sanitizePhone', () => {
    it('should allow valid phone characters', () => {
      const input = '+90 (532) 123-45-67';
      const result = sanitizePhone(input);
      expect(result).to.equal('+90 (532) 123-45-67');
    });

    it('should remove invalid characters', () => {
      const input = '+90<script>alert()</script> 532 123 45 67';
      const result = sanitizePhone(input);
      expect(result).to.equal('+90() 532 123 45 67');
    });
  });
});
