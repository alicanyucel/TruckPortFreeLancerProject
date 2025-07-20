import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isTyping = false;
  messageIdCounter = 1;

  constructor(private translationService: TranslationService) {}

  // Predefined responses
  botResponses = [
    {
      keywords: ['merhaba', 'selam', 'hello', 'hi'],
      response: 'Merhaba! TruckPort\'a hoş geldiniz. Size nasıl yardımcı olabilirim? 🚛'
    },
    {
      keywords: ['hizmet', 'service', 'neler yapıyorsunuz'],
      response: 'TruckPort olarak kamyon taşımacılığı, lojistik çözümleri, depolama ve uluslararası nakliye hizmetleri sunuyoruz. Hangi hizmetimiz hakkında bilgi almak istersiniz?'
    },
    {
      keywords: ['fiyat', 'ücret', 'teklif', 'price'],
      response: 'Fiyat teklifimiz için lütfen İletişim sayfamızdan bizimle iletişime geçin. Size özel teklifimizi hazırlayalım! 💰'
    },
    {
      keywords: ['takip', 'track', 'kargo', 'araç'],
      response: 'Canlı Takip sayfamızdan araçlarımızın gerçek zamanlı konumunu takip edebilirsiniz. 📍'
    },
    {
      keywords: ['iletişim', 'telefon', 'adres', 'contact'],
      response: 'İletişim bilgilerimiz: 📞 +90 (212) 123 45 67 | 📧 info@truckport.com | 📍 İstanbul/Türkiye'
    },
    {
      keywords: ['teşekkür', 'sağol', 'thank'],
      response: 'Rica ederim! Başka bir sorunuz varsa çekinmeden sorun. İyi günler! 😊'
    }
  ];

  ngOnInit() {
    // Welcome message
    setTimeout(() => {
      this.addBotMessage('Merhaba! TruckPort müşteri destek chatbot\'uyum. Size nasıl yardımcı olabilirim? 🤖');
    }, 1000);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (this.currentMessage.trim()) {
      this.addUserMessage(this.currentMessage);
      this.processUserMessage(this.currentMessage);
      this.currentMessage = '';
    }
  }

  addUserMessage(text: string) {
    const message: ChatMessage = {
      id: this.messageIdCounter++,
      text: text,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(message);
    this.scrollToBottom();
  }

  addBotMessage(text: string) {
    this.isTyping = true;
    
    setTimeout(() => {
      const message: ChatMessage = {
        id: this.messageIdCounter++,
        text: text,
        isUser: false,
        timestamp: new Date()
      };
      this.messages.push(message);
      this.isTyping = false;
      this.scrollToBottom();
    }, 1500); // Simulate typing delay
  }

  processUserMessage(userMessage: string) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Find matching response
    const matchedResponse = this.botResponses.find(response => 
      response.keywords.some(keyword => lowerMessage.includes(keyword))
    );

    if (matchedResponse) {
      this.addBotMessage(matchedResponse.response);
    } else {
      // Default response
      this.addBotMessage('Üzgünüm, bu konuda size yardımcı olamıyorum. Daha detaylı bilgi için İletişim sayfamızdan bizimle iletişime geçebilirsiniz. 📞');
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  sendQuickMessage(type: string) {
    let message = '';
    switch (type) {
      case 'services':
        message = this.translationService.translate('chatbot.quickMessages.services');
        break;
      case 'quote':
        message = this.translationService.translate('chatbot.quickMessages.quote');
        break;
      case 'contact':
        message = this.translationService.translate('chatbot.quickMessages.contact');
        break;
    }
    this.currentMessage = message;
    this.sendMessage();
  }
}
