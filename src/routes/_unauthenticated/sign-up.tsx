import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_unauthenticated/sign-up"!</div>
}
