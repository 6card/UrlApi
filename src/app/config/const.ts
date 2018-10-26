import { InjectionToken, Injectable } from '@angular/core';

export const APP_CONST = new InjectionToken<string>('app.const');
export const APP_CONFIG = new InjectionToken<string>('app.config');

export const Constants = {
    ADD: 0,
    DELETE: 1
}