import { InjectionToken } from '@angular/core';
import { AppEnvironment } from '../models/environment.model';

export const ENVIRONMENT_TOKEN = new InjectionToken<AppEnvironment>('ENVIRONMENT_TOKEN');
