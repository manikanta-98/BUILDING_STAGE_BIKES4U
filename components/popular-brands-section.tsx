import { brands } from "@/lib/data"

const uniqueBrands = [...new Set(brands)]

export function PopularBrandsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
            Popular Brands
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find bikes from all major manufacturers in India
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {uniqueBrands.map((brand, index) => (
            <button
              key={`${brand}-${index}`}
              className="px-6 py-3 rounded-full border border-border bg-card font-medium hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
