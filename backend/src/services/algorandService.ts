import algosdk from 'algosdk';
import dotenv from 'dotenv';
dotenv.config();

const algodClient = new algosdk.Algodv2(
  '',
  process.env.ALGORAND_NODE_URL || 'https://testnet-api.algonode.cloud',
  443
);

const getAdminAccount = () => {
  const mn = process.env.ALGORAND_MNEMONIC as string;
  return algosdk.mnemonicToSecretKey(mn);
};

export const registerAssetOnChain = async (
  assetId: string,
  name: string,
  type: string,
  owner: string
): Promise<{ txHash: string }> => {
  try {
    const adminAccount = getAdminAccount();
    const suggestedParams = await algodClient.getTransactionParams().do();

    const noteData = JSON.stringify({
      action: 'REGISTER_ASSET',
      assetId,
      name,
      type,
      owner,
      platform: 'Dakhla360',
      timestamp: new Date().toISOString(),
    });

    const note = new TextEncoder().encode(noteData);

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: adminAccount.addr,
      receiver: adminAccount.addr,
      amount: 0,
      note,
      suggestedParams,
    });

    const signedTxn = txn.signTxn(adminAccount.sk);
    const { txid } = await algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(algodClient, txid, 4);

    console.log('✅ Asset registered on Algorand:', txid);
    return { txHash: txid };
  } catch (error: any) {
    console.error('❌ Algorand error:', error.message);
    throw error;
  }
};

export const transferOwnershipOnChain = async (
  assetId: string,
  newOwner: string
): Promise<{ txHash: string }> => {
  try {
    const adminAccount = getAdminAccount();
    const suggestedParams = await algodClient.getTransactionParams().do();

    const noteData = JSON.stringify({
      action: 'TRANSFER_OWNERSHIP',
      assetId,
      newOwner,
      platform: 'Dakhla360',
      timestamp: new Date().toISOString(),
    });

    const note = new TextEncoder().encode(noteData);

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: adminAccount.addr,
      receiver: adminAccount.addr,
      amount: 0,
      note,
      suggestedParams,
    });

    const signedTxn = txn.signTxn(adminAccount.sk);
    const { txid } = await algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(algodClient, txid, 4);

    console.log('✅ Ownership transferred on Algorand:', txid);
    return { txHash: txid };
  } catch (error: any) {
    console.error('❌ Algorand transfer error:', error.message);
    throw error;
  }
};

export const getTransactionDetails = async (txHash: string) => {
  try {
    const txInfo = await algodClient.pendingTransactionInformation(txHash).do();
    return txInfo;
  } catch (error: any) {
    console.error('❌ Failed to get transaction:', error.message);
    throw error;
  }
};