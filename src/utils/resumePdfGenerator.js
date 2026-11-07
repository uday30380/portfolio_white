import React from 'react';
import { pdf } from '@react-pdf/renderer';
import ResumePdfDocument from './ResumePdfDocument';

export const generateResumePdfBlob = async (resumeData) => {
    const docElement = React.createElement(ResumePdfDocument, { resumeData });
    const asBlob = await pdf(docElement).toBlob();
    return asBlob;
};

export const downloadResumePdf = async (resumeData, fileName = 'Uday_Kiran_Vempati_Resume.pdf') => {
    const blob = await generateResumePdfBlob(resumeData);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
};

export const previewResumePdfInTab = async (resumeData) => {
    const blob = await generateResumePdfBlob(resumeData);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
};

