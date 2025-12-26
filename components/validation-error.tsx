import { Alert, AlertDescription } from "@/components/ui/alert"

interface ValidationErrorProps {
  errors: Array<{ field: string; message: string }>
}

export function ValidationError({ errors }: ValidationErrorProps) {
  if (errors.length === 0) return null

  return (
    <Alert variant="destructive">
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1">
          {errors.map((error, index) => (
            <li key={index}>{error.message}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
