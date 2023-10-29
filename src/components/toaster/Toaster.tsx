import { SnackbarProvider, useSnackbar } from "notistack";
import { FC, PropsWithChildren } from "react";
import { IntegrationNotistackProps } from "./types";

export const useToaster = useSnackbar

export const ToasterProvider: FC<PropsWithChildren<IntegrationNotistackProps>> = ({ children }) => {
    return (
        <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'top'
            }}
        >
            {children}
        </SnackbarProvider>
    )
}
