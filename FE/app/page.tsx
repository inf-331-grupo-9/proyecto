import { Marathons } from "@/components/marathons"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Runtrack</h1>
      <Marathons />
    </main>
  )
}
