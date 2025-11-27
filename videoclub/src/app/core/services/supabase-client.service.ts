// core/services/supabase-client.service.ts
import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseClientService {
  private _client: SupabaseClient;

  constructor() {
    this._client = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  get client(): SupabaseClient {
    return this._client;
  }
}
