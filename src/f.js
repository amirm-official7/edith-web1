const functions = [
    {
        name: "OpenUrl",
        func: (params) => {
            window.open(params.url)
        }
    }
]

export default functions;
