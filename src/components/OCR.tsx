'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createWorker } from 'tesseract.js';

const OcrReader: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<string>('');
  const [ocrStatus, setOcrStatus] = useState<string>('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
    setOcrResult('');
    setOcrStatus('');

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const readImageText = async () => {
    if (!selectedImage) return;

    setOcrStatus('Processing...');

    const worker = await createWorker('eng', 1, {
      logger: (m) => console.log(m),
    });

    try {
      const {
        data: { text },
      } = await worker.recognize(selectedImage);

      setOcrResult(text);
      setOcrStatus('Completed');
    } catch (error) {
      console.error(error);
      setOcrStatus('Error occurred during processing.');
    } finally {
      await worker.terminate();
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {imagePreview && (
        <div style={{ marginTop: 15, position: 'relative', width: 350, height: 250 }}>
          <Image
            src={imagePreview}
            alt="Uploaded content"
            fill
            style={{ objectFit: 'contain', borderRadius: 10 }}
          />
        </div>
      )}

      <div style={{ marginTop: 15 }}>
        <button
          onClick={readImageText}
          style={{
            background: '#FFFFFF',
            borderRadius: 7,
            color: '#000000',
            padding: 5,
          }}
        >
          Submit
        </button>
      </div>

      <p style={{ marginTop: 20, fontWeight: 700 }}>Status:</p>
      <p>{ocrStatus}</p>
      <h3 style={{ marginTop: 10, fontWeight: 700 }}>Extracted Text:</h3>
      <p
        dangerouslySetInnerHTML={{
          __html: ocrResult.replace(/\n/g, '<br />').replace(/[=,—,-,+]/g, ' '),
        }}
        style={{
          border: '1px solid white',
          width: 'fit-content',
          padding: 10,
          marginTop: 10,
          borderRadius: 10,
        }}
      />
    </div>
  );
};

export default OcrReader;
