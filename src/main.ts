import {
	getSSLHubRpcClient,
	Metadata
} from '@farcaster/hub-nodejs';


const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY as string;
const AIRSTACK_HUB = 'hubs-grpc.airstack.xyz';
const NEYNAR_HUB = process.env.HUB_URL2 as string;

const runSampleCode = async (HUB_URL: string, API_KEY?: string) => {
	const client = getSSLHubRpcClient(HUB_URL);

	client.$.waitForReady(Date.now() + 10000, async (e) => {
		if (e) {
			console.error(`Failed to connect to the gRPC server:`, e);
			process.exit(1);
		} else {


			console.log(`Connected to the gRPC server`);
			if (API_KEY) {
				const metadata = new Metadata();
				metadata.add("x-airstack-hubs", API_KEY);
			}
			try {

				const version = (await client.getInfo({
					dbStats: false,
				}))._unsafeUnwrap()

				console.dir(version, { depth: null });

			} catch (e) {
				console.error(e)
			}
			client.close();
		}
	});
}

async function main () {
	// WORKS AS EXPECTED
	await runSampleCode(NEYNAR_HUB);
	// DOES NOT WORK - AIRSTACK
	await runSampleCode(AIRSTACK_HUB, AIRSTACK_API_KEY);
}

main();