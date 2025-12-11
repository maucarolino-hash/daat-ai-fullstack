import { describe, it, expect, vi } from 'vitest';
import { generatePDF } from './pdfGenerator';
import React from 'react';

// Mock dependencies
vi.mock('@react-pdf/renderer', () => ({
    pdf: () => ({
        toBlob: async () => new Blob(['fake-pdf'], { type: 'application/pdf' })
    }),
    Page: () => 'Page',
    Text: () => 'Text',
    View: () => 'View',
    Document: () => 'Document',
    Image: () => 'Image',
    StyleSheet: { create: () => ({}) },
    Font: { register: () => { } }
}));

// Mock DaatReportPDF component via module mock if necessary, 
// but since pdfGenerator imports it, we might need to mock the import itself if it has heavy dependencies.
// For now let's see if shallow rendering works or if we need to deep mock.
vi.mock('../components/DaatReportPDF', () => ({
    default: () => null
}));

describe('generatePDF', () => {
    it('should generate PDF blob and open/download it successfully with chart image', async () => {
        const mockResult = { feedback: "Test feedback", score: 80 };
        const chartImage = "data:image/png;base64,fakeimage";

        // Mock window.URL.createObjectURL and window.open
        global.URL.createObjectURL = vi.fn(() => 'blob:fake-url');
        global.open = vi.fn();

        // Mock document.createElement and click for download simulation
        const mockLink = { href: '', download: '', click: vi.fn(), remove: vi.fn() };
        global.document.createElement = vi.fn(() => mockLink);
        global.document.body.appendChild = vi.fn();
        global.document.body.removeChild = vi.fn();

        await generatePDF(mockResult, "Segment", "Problem", "Value Prop", "professional", false, chartImage);

        expect(global.URL.createObjectURL).toHaveBeenCalled();
        // Verify that createObjectURL was called with a Blob
        const blobArg = global.URL.createObjectURL.mock.calls[0][0];
        expect(blobArg).toBeInstanceOf(Blob);

        // Verify download link interaction
        expect(global.document.createElement).toHaveBeenCalledWith('a');
        expect(mockLink.download).toMatch(/Daat_Relatorio_.*\.pdf/);
        expect(mockLink.click).toHaveBeenCalled();
    });

    it('should handle missing chart image gracefully', async () => {
        const mockResult = { feedback: "Test feedback", score: 80 };

        global.URL.createObjectURL = vi.fn(() => 'blob:fake-url');
        global.document.createElement = vi.fn(() => ({ Click: vi.fn(), click: vi.fn(), remove: vi.fn() }));

        await generatePDF(mockResult, "Segment", "Problem", "Value Prop", "professional", false, null);

        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
});
