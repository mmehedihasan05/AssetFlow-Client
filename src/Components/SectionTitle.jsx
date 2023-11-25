const SectionTitle = ({ data }) => {
    const { title, description, noBorder } = data;
    return (
        <div className="flex items-center justify-center">
            {noBorder ? (
                ""
            ) : (
                <div className="hidden md:block border-b-[3px] w-36 border-[--text-primary]"></div>
            )}

            <div className="text-center px-4">
                <h1 className="text-primary sectionHeading text-3xl md:text-4xl font-semibold text-[--text-primary]">
                    {title}
                </h1>
                <div className="text-[--text-secondary]">{description}</div>
            </div>
            {noBorder ? (
                ""
            ) : (
                <div className="hidden md:block border-b-[3px] w-36 border-[--text-primary]"></div>
            )}
        </div>
    );
};

export default SectionTitle;
