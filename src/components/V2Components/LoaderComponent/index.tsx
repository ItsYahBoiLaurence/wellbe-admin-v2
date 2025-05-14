import { LoadingOverlay } from "@mantine/core";

export default function index({ size }: { size?: string }) {
    return <LoadingOverlay
        h={size ?? 100}
        pos={'relative'}
        visible={true}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 20 }}
        loaderProps={{ color: '#515977', type: 'bars' }}
    />
}