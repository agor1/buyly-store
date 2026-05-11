import ProductDetailsView from "@/components/products/product-details-view";

interface ProductDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;

  return <ProductDetailsView slug={slug} />;
}
