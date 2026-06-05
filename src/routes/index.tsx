import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#141414] px-8 text-white">
      <h1 className="text-3xl font-semibold tracking-tight">
        Cloud Animation
      </h1>
      <p className="mt-4 max-w-md text-center text-[#9a9a9a]">
        Your canvas is ready. Follow the{' '}
        <a
          href="https://emanuelecodes.com/cloud-tutorial"
          className="text-white underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          tutorial
        </a>{' '}
        and build the cloud here.
      </p>
    </main>
  )
}
