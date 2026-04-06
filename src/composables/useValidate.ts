import { reactive } from 'vue'

type Validator<T> = (value: T) => string | null

type Schema<Form> = {
  [K in keyof Form]: Validator<Form[K]>[]
}

type Errors<Form> = {
  [K in keyof Form]?: string | null
}

export function useValidate<Form extends Record<string, any>>(
  schema: Schema<Form>
) {
  const errors = reactive<Errors<Form>>({}) as Errors<Form>

  const validateField = <K extends keyof Form>(
    field: K,
    value: Form[K]
  ): void => {
    const rules = schema[field]
    errors[field] = null

    for (const rule of rules) {
      const error = rule(value)
      if (error) {
        errors[field] = error
        break
      }
    }
  }

  const validateAll = (form: Form): boolean => {
    let isValid = true

    for (const field in schema) {
      const key = field as keyof Form
      validateField(key, form[key])

      if (errors[key]) {
        isValid = false
      }
    }

    return isValid
  }

  return {
    errors,
    validateField,
    validateAll
  }
}