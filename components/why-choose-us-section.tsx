import { Shield, ThumbsUp, BadgeCheck, Repeat, Clock, HeadphonesIcon } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "6 Month Warranty",
    description: "All bikes come with engine warranty and free service support"
  },
  {
    icon: BadgeCheck,
    title: "Verified Sellers",
    description: "Every seller is verified and all documents are thoroughly checked"
  },
  {
    icon: ThumbsUp,
    title: "Quality Assured",
    description: "200+ point inspection ensures you get the best quality bikes"
  },
  {
    icon: Repeat,
    title: "Easy Exchange",
    description: "Exchange your old bike and get the best value towards a new one"
  },
  {
    icon: Clock,
    title: "Quick Process",
    description: "Complete documentation and transfer within 24 hours"
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our team is always ready to help you with any queries"
  }
]

export function WhyChooseUsSection() {
  return (
    <section id="why-choose" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3">
            Why Choose BIKES4u?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {"We're committed to providing the best experience for buying and selling second-hand bikes"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
