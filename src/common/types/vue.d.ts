declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
declare module 'lrz' {
  export default function (
    file: File | Blob
  ): Promise<{ base64: string; base64Len: number; file: Blob; fileLen: number; formData: FormData; origin: File }>
}
