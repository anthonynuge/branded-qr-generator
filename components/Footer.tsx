const Footer = () => {
    return (
        <footer className="inner fixed bottom-0 left-0 right-0 flex h-[var(--footer-h)] items-center justify-center gap-6 pt-1 pb-[1px] text-xs lg:pt-2 lg:pb-2">
            <span className="font-mono">© {new Date().getFullYear()} AVQN.dev</span>
            <span className="font-mono">V4.0</span>
        </footer>
    )
}

export default Footer