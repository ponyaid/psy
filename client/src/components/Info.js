export const Info = ({ handler, name, desc }) => {
    return (
        <div className="page">
            <header className="page__header">
                <button
                    onClick={handler}
                    className="icon-btn page__icon-btn page__icon-btn_left icon-btn_back"></button>
                <p className="page__title">Информация о тесте</p>
            </header>
            <div>
                <h3>{name}</h3>
                <p dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
        </div>
    )
}