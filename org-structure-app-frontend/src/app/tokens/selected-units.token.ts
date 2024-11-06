import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';

export const SELECTED_UNITS: InjectionToken<Subject<Array<number>>> = new InjectionToken<Subject<Array<number>>>('SELECTED_UNITS');