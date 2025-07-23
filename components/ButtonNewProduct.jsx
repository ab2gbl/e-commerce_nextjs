import withRole from "@/utils/withRole"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

function ButtonNewProduct({ url }) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
        <Link href={url}>
          <Plus className="h-5 w-5 mr-2" />
          New Product
        </Link>
      </Button>
    </div>
  )
}

export default withRole(ButtonNewProduct, "ADMIN")
