import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_unauthenticated/"!</div>
}
