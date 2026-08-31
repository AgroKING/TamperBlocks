import SideRays from '../components/SideRays';

function BlockchainStatus() {

    const blocks = [
        {
            number: 0,
            hash: "0000a91f...",
            previousHash: "GENESIS",
            credentials: 0,
            status: "GENESIS"
        },
        {
            number: 1,
            hash: "00008f42...",
            previousHash: "0000a91f...",
            credentials: 3,
            status: "VALID"
        },
        {
            number: 2,
            hash: "0000c721...",
            previousHash: "00008f42...",
            credentials: 5,
            status: "VALID"
        },
        {
            number: 3,
            hash: "0000e194...",
            previousHash: "0000c721...",
            credentials: 2,
            status: "VALID"
        }
    ];

    return (
        <div className="blockchain-page">

            {/* Animated background rays */}
            <div className="blockchain-rays">
                <SideRays
                    speed={1.2}
                    rayColor1="#3b82f6"
                    rayColor2="#60a5fa"
                    intensity={3}
                    spread={2.5}
                    origin="top-right"
                    tilt={10}
                    saturation={1.2}
                    blend={0.6}
                    falloff={2.2}
                    opacity={1}
                />
            </div>

            <div className="blockchain-stars"></div>

            <header className="blockchain-header">

                <span className="blockchain-eyebrow">
                    TAMPERBLOCKS NETWORK
                </span>

                <h1>Blockchain Status</h1>

                <p>
                    Explore the current structure and integrity
                    of the credential blockchain.
                </p>

                <div className="network-status">
                    <span className="status-dot"></span>
                    NETWORK OPERATIONAL
                </div>

            </header>


            <section className="blockchain-stats">

                <div className="blockchain-stat">
                    <span>NETWORK</span>
                    <strong>ACTIVE</strong>
                </div>

                <div className="blockchain-stat">
                    <span>BLOCKS</span>
                    <strong>{blocks.length}</strong>
                </div>

                <div className="blockchain-stat">
                    <span>CONSENSUS</span>
                    <strong>VALID</strong>
                </div>

                <div className="blockchain-stat">
                    <span>INTEGRITY</span>
                    <strong>100%</strong>
                </div>

            </section>


            <section className="chain-section">

                <div className="chain-title">
                    <span>LIVE LEDGER</span>
                    <h2>Blockchain Structure</h2>
                </div>


                <div className="blockchain-chain">

                    {blocks.map((block, index) => (

                        <div
                            className="block-wrapper"
                            key={block.number}
                        >

                            <div className="block-node">
                                <span>
                                    BLOCK
                                </span>

                                <strong>
                                    #{block.number}
                                </strong>
                            </div>


                            <div className="block-card">

                                <div className="block-card-header">

                                    <span>
                                        BLOCK #{block.number}
                                    </span>

                                    <span className="block-valid">
                                        ● {block.status}
                                    </span>

                                </div>


                                <div className="block-data">

                                    <div>
                                        <span>HASH</span>
                                        <code>
                                            {block.hash}
                                        </code>
                                    </div>

                                    <div>
                                        <span>PREVIOUS HASH</span>
                                        <code>
                                            {block.previousHash}
                                        </code>
                                    </div>

                                    <div>
                                        <span>CREDENTIALS</span>
                                        <strong>
                                            {block.credentials}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            {index < blocks.length - 1 && (
                                <div className="chain-link">
                                    <span></span>
                                </div>
                            )}

                        </div>

                    ))}

                </div>

            </section>


            <div className="blockchain-footer">

                <span>
                    ◈
                </span>

                Each block references the hash of the
                previous block, creating a tamper-evident chain.

            </div>

        </div>
    );
}

export default BlockchainStatus;