import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Đảm bảo Socket.io chỉ chạy trên trình duyệt (tránh lỗi SSR nếu sau này có dùng)
    if (isPlatformBrowser(this.platformId)) {
      this.socket = io(environment.socketUrl);
    }
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      if (this.socket) {
        this.socket.on(eventName, (data: any) => {
          subscriber.next(data);
        });
      }
    });
  }
}