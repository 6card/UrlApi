import { InjectionToken, Injectable } from '@angular/core';

export const APP_CONST = new InjectionToken<string>('app.const');

export const Constants = {
    mediasMode: {
        ADD: 0,
        DELETE: 1
    }
}