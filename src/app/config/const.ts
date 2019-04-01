import { InjectionToken, Injectable } from '@angular/core';

export const APP_CONST = new InjectionToken<string>('app.const');

export const Constants = {
    mediasMode: {
        ADD: 0,
        DELETE: 1
    },
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    AUTH_CHECK_ACCESS: '2B646AA4-4ECC-43E0-8C42-4527329B0051'
};
