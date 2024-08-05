import withRole from "@/utils/withRole";
import Link from "next/link";

function ButtonNewProduct() {
  return (
    <Link
      href="/seller/newproduct"
      style={{ position: "fixed", bottom: "10vh", right: "10vw" }}
    >
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        New Product
      </button>
    </Link>
  );
}

export default withRole(ButtonNewProduct, "ADMIN");
