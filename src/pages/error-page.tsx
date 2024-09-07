import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = useRouteError() as any;
    console.error(error);

    return (
        <div id="error-page">
            <p>Der skete en fejl</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}
