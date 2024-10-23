import { Component } from '@angular/core';
import OpenAI from "openai";
import { OpenaiService } from './openai.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  prompt: string = '';
  response: any;
  imageData: any = 'null';
  summary: string | null = null;
  selectedFile: File | null = null;
  extractedText: string = '';
  userMessage: string = '';
  chatMessages: Array<{ role: string, content: string }> = [];

  constructor(private openaiService: OpenaiService,private http: HttpClient) {
  


  // const response: any = openai.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //     {
  //       role: "user",
  //       content: [
  //         { type: "text", text: "suggest 5 questions about this chart" },
  //         {
  //           type: "image_url",
  //           image_url: {
  //             "url": "https://cdn.boldbi.com/wp/blogs/combo-chart/combo-chart-example.webp",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // });

  // console.log(response.choices[0],32);

  this.openaiService.generateImageResponse()

  }

  getResponse() {
    this.openaiService.generateResponse(this.prompt).subscribe({
      next: (data) => this.response = data,
      error: (err) => console.error(err)
    });
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    // Add user message to chat
    this.chatMessages.push({ role: 'user', content: this.userMessage });

    // Get response from OpenAI
    this.openaiService.generateResponse(this.userMessage).subscribe(response => {
      const aiResponse = response.choices[0].message.content;
      this.chatMessages.push({ role: 'assistant', content: aiResponse });
    });

    // Clear the input field
    this.userMessage = '';
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  convertImageToText(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result as string;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearerw`
      });

      const requestBody = {
        image: base64Image.split(',')[1], // Remove data URI prefix if needed
      };

      this.http
        .post('https://api.openai.com/v1/images/generate', requestBody, { headers })
        .subscribe(
          (response: any) => {
            this.extractedText = response.data.text;
          },
          (error) => {
            console.error('Error:', error);
          }
        );
    };

    reader.readAsDataURL(this.selectedFile);
  }

  // async submitImage() {
  //   if (this.imageData) {
  //     try {
  //       this.summary = null; // Reset summary
  //       const response = await this.openaiService.getSummaryFromImage(this.imageData);
  //       this.summary = response.summary; // Adjust based on your API response structure
  //     } catch (error) {
  //       console.error('Error getting summary:', error);
  //     }
  //   }
  // }
}
