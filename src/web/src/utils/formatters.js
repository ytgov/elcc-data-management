

export function formatDollar(value) {
    return Intl.NumberFormat("en", {
        currency: "USD",
        style: "currency",
    }).format(value);
}