import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private ocrApiKey = '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'; // Replace with your OpenAI API key
  private ocrApiUrl = 'https://api.openai.com/v1/chat/completions'; // Change based on your use case

  constructor(private http: HttpClient) {}

  generateResponse(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.ocrApiKey}`
    });

    const body = {
      model: 'gpt-3.5-turbo', // or any model you want to use
      messages: [{ role: 'user', content: prompt }]
    };

    return this.http.post<any>(this.ocrApiUrl, body, { headers });
  }

  async  generateImageResponse() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.ocrApiKey}`
    });

    const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg";

  // Convert image URL to Base64
  const base64ImageWithPrefix: any = await this.convertImageUrlToBase64(imageUrl);

    const body = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "suggest 5 questions about this chart" },
            {
              type: "image_url",
              image_url: {
                "url": "https://cdn.boldbi.com/wp/blogs/combo-chart/combo-chart-example.webp",
              },
            },
          ],
        },
      ],
    };

    return this.http.post<any>(this.ocrApiUrl, body, { headers }).subscribe((res: any) => console.log(res));
  }

  convertImageUrlToBase64(url: string): Promise<string> {
    return fetch(url)
      .then(response => response.blob()) // Fetch the image as a Blob
      .then(blob => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string; // Contains full Data URL with prefix
            resolve(base64String); // Return the full Data URL (including prefix)
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob); // Read Blob as Base64 Data URL (with prefix)
        });
      });
  }

private async getSummaryFromText(text: string): Promise<any> {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.ocrApiKey}` // Include OpenAI API key here
    };

    // Make sure you provide the model parameter
    const body = {
        model: 'gpt-3.5-turbo', // Ensure this is specified
        messages: [{ role: 'user', content: `Please summarize this text: ${text}` }]
    };

    try {
        const response = await axios.post(this.ocrApiUrl, body, { headers });
        return response.data.choices[0].message.content; // Adjust based on your API response structure
    } catch (error: any) {
        if (error.response) {
            console.error('Error in OpenAI API call:', error.response.data); // Log the detailed error message
        } else {
            console.error('Error:', error.message);
        }
        throw error; // Handle errors appropriately
    }
}

}
