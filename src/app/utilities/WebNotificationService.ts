import { inject, Injectable } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({ providedIn: 'root' })
export class WebNotificationService {
  #swPush = inject(SwPush)

  messages = toSignal(this.#swPush.messages)

  constructor() {
    this.#swPush.messages.subscribe(() => {
      // Vibrate for 200ms, pause for 100ms, vibrate for 200ms
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    });
  }

  get isEnabled() {
    return this.#swPush.isEnabled;
  }
}