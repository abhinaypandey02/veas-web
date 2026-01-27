export interface CourseProps {
    title: string;
    description: string;
    price: string;
    image?: string;
    tags?: string[];
}

export function CourseCard({ title, description, price, tags }: CourseProps) {
    return (
        <div className="group relative p-6 rounded-2xl border border-cosmic-lavender/50 bg-white/70 hover:bg-white transition-all duration-500 overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-cosmic-cobalt text-xl">↗</span>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {tags?.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border border-cosmic-purple/30 text-muted bg-cosmic-lavender/20">
                        {tag}
                    </span>
                ))}
            </div>

            <h3 className="text-xl font-serif mb-2 text-foreground group-hover:text-cosmic-cobalt transition-colors">
                {title}
            </h3>

            <p className="text-sm text-muted mb-6 leading-relaxed">
                {description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-foreground/10">
                <span className="font-mono text-sm text-cosmic-cobalt">{price}</span>
                <button className="text-xs uppercase tracking-widest text-foreground hover:text-cosmic-cobalt transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
}
