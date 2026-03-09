import '@testing-library/jest-dom';
import './locale';
import { vi } from 'vitest';

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
    vi.spyOn(console, 'warn').mockImplementation(() => { });
});
