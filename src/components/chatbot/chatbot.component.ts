import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

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
export class ChatbotComponent implements OnInit, OnDestroy {
  isOpen = false;
  messages: ChatMessage[] = [];
  currentMessage = '';
  isTyping = false;
  messageIdCounter = 1;
  private languageSubscription: Subscription = new Subscription();

  constructor(private translationService: TranslationService) {}

  // Predefined responses
  getBotResponses() {
    return [
      {
        keywords: ['merhaba', 'selam', 'hello', 'hi'],
        response: this.translationService.translate('chatbot.responses.welcome')
      },
      {
        keywords: ['hizmet', 'service', 'neler yapıyorsunuz', 'what are your services'],
        response: this.translationService.translate('chatbot.responses.services')
      },
      {
        keywords: ['fiyat', 'ücret', 'teklif', 'price', 'quote'],
        response: this.translationService.translate('chatbot.responses.price')
      },
      {
        keywords: ['takip', 'track', 'kargo', 'araç', 'tracking', 'vehicle'],
        response: this.translationService.translate('chatbot.responses.tracking')
      },
      {
        keywords: ['iletişim', 'telefon', 'adres', 'contact', 'phone', 'address'],
        response: this.translationService.translate('chatbot.responses.contact')
      },
      {
        keywords: ['teşekkür', 'sağol', 'thank', 'thanks'],
        response: this.translationService.translate('chatbot.responses.thanks')
      }
    ];
  }

  ngOnInit() {
    // Welcome message - dil değişikliğinde güncellenecek
    this.sendWelcomeMessage();

    // Dil değişikliklerini dinle ve welcome mesajını güncelle
    this.languageSubscription = this.translationService.getLanguage$().subscribe(() => {
      // Mevcut mesajları temizle ve yeni welcome mesajı gönder
      this.messages = [];
      this.messageIdCounter = 1;
      this.sendWelcomeMessage();
    });
  }

  sendWelcomeMessage() {
    setTimeout(() => {
      this.addBotMessage(this.translationService.translate('chatbot.responses.welcome'));
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
    const botResponses = this.getBotResponses();
    
    // Find matching response
    const matchedResponse = botResponses.find(response => 
      response.keywords.some(keyword => lowerMessage.includes(keyword))
    );

    if (matchedResponse) {
      this.addBotMessage(matchedResponse.response);
    } else {
      // Default response
      this.addBotMessage(this.translationService.translate('chatbot.responses.default'));
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

  ngOnDestroy() {
    this.languageSubscription.unsubscribe();
  }
}
