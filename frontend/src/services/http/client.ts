import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getIdToken } from 'firebase/auth';

import { auth } from 'src/config/firebase';
import { ApiResponse } from 'src/types-dtos/user.types';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const httpClient = axios.create({
  baseURL,
  timeout: 15000,
});

function createTraceId(): string {
  return `trace_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data as { detail?: string; message?: string } | undefined;
    return detail?.detail ?? detail?.message ?? error.message ?? 'Error de red inesperado.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Error de red inesperado.';
}

httpClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('No hay usuario autenticado. Inicia sesion para continuar.');
    }

    const traceId = createTraceId();
    config.headers['x-trace-id'] = traceId;

    const token = await getIdToken(currentUser);
    config.headers.Authorization = `Bearer ${token}`;

    const method = (config.method ?? 'GET').toUpperCase();
    const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
    console.info(`[HTTP][REQ][${traceId}] ${method} ${url}`);

    return config;
  },
  async (error: unknown) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const traceId = response.config.headers?.['x-trace-id'] as string | undefined;
    const method = (response.config.method ?? 'GET').toUpperCase();
    const url = `${response.config.baseURL ?? ''}${response.config.url ?? ''}`;
    console.info(`[HTTP][RES][${traceId ?? 'no-trace'}] ${response.status} ${method} ${url}`);

    const normalized: ApiResponse<unknown> = {
      success: true,
      data: response.data,
    };

    response.data = normalized;
    return response;
  },
  async (error: AxiosError | Error) => {
    const cfg = axios.isAxiosError(error) ? error.config : undefined;
    const traceId = cfg?.headers?.['x-trace-id'] as string | undefined;
    const method = (cfg?.method ?? 'GET').toUpperCase();
    const url = `${cfg?.baseURL ?? ''}${cfg?.url ?? ''}`;
    const status = axios.isAxiosError(error) ? (error.response?.status ?? 'NETWORK') : 'ERROR';
    console.error(`[HTTP][ERR][${traceId ?? 'no-trace'}] ${status} ${method} ${url} -> ${normalizeErrorMessage(error)}`);

    const normalized: ApiResponse<never> = {
      success: false,
      error: normalizeErrorMessage(error),
      data: undefined as never,
    };

    const safeConfig = (
      axios.isAxiosError(error) ? error.config : undefined
    ) ?? ({ headers: {} } as InternalAxiosRequestConfig);

    const safeResponse: AxiosResponse<ApiResponse<never>> = {
      data: normalized,
      status: axios.isAxiosError(error) ? (error.response?.status ?? 500) : 500,
      statusText: axios.isAxiosError(error) ? (error.response?.statusText ?? 'ERROR') : 'ERROR',
      headers: axios.isAxiosError(error) ? (error.response?.headers ?? {}) : {},
      config: safeConfig,
    };

    return Promise.resolve(safeResponse);
  },
);

export default httpClient;
