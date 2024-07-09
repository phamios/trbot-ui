import Button from '@/components/bootstrap/Button';
import FormGroup from '@/components/bootstrap/forms/FormGroup';
import Input from '@/components/bootstrap/forms/Input';
import OffCanvas, { OffCanvasBody, OffCanvasHeader, OffCanvasTitle } from '@/components/bootstrap/Offcanvas';
import Spinner from '@/components/bootstrap/Spinner';
import Toasts from '@/components/bootstrap/Toasts';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import ServiceAPI from '@/services/service-api';
import { TAddChain, TChain, TUpdateChain } from '@/type/data/chains.type';
import { useFormik } from 'formik';
import { isEmpty, isNil, omitBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import * as yup from 'yup';

const validate = () => {
	return yup.object().shape({
		chainId: yup.number().required(),
		name: yup.string().max(50).required(),
		rpcUri: yup.string().url().required(),
		wsRpcUri: yup
			.string()
			.matches(/^wss?:\/\/[^\s/$.?#].[^\s]*$/i, 'Invalid WebSocket URL')
			.required(),
	});
};

interface FormikValues {
	chainId?: string;
	name?: string;
	rpcUri?: string;
	wsRpcUri?: string;
}

interface EditChainOffCanvasProps {
	chain?: TChain | null;
	mode: 'add' | 'edit';
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
	onSuccess?: () => void;
}

const EditChainOffCanvas: React.FC<EditChainOffCanvasProps> = ({ chain, mode, isOpen, setOpen, onSuccess }) => {
	const { addToast } = useToasts();

	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const formik = useFormik<FormikValues>({
		initialValues: !chain
			? {}
			: {
					chainId: chain.chainId,
					name: chain.name,
					rpcUri: chain.rpcUri,
					wsRpcUri: chain.wsRpcUri,
			  },
		validationSchema: validate(),
		onSubmit: async (values) => {
			try {
				setIsProcessing(true);
				const { chainId, name, rpcUri, wsRpcUri } = values;

				if (mode === 'edit' && !isNil(chain)) {
					const dto: TUpdateChain = omitBy(
						{
							name: name as string,
							rpcUri: rpcUri as string,
							wsRpcUri: wsRpcUri as string,
						},
						isNil,
					);

					if (!isEmpty(dto)) {
						const success = await ServiceAPI.updateChain(chain.id, dto);
						if (!success) {
							throw new Error(`Failed to update chain ${chain.name}`);
						}
					}
				} else {
					// add new
					const dto: TAddChain = omitBy(
						{
							chainId: String(chainId),
							name: name as string,
							rpcUri: rpcUri as string,
							wsRpcUri: wsRpcUri as string,
						},
						isNil,
					) as TAddChain;

					if (!isEmpty(dto)) {
						const success = await ServiceAPI.createChain(dto);
						if (!success) {
							throw new Error(`Failed to add new chain ${name as string}`);
						}
					}
				}

				if (typeof onSuccess === 'function') {
					onSuccess();
				}
			} catch (e: any) {
				addToast(
					<Toasts title="Error" icon="Error" iconColor="danger" isDismiss>
						{e.message}
					</Toasts>,
					{
						autoDismiss: true,
					},
				);
			}
			setIsProcessing(false);
		},
	});

	const deleteChain = useOnEventCallback(async () => {
		try {
			if (chain?.id) {
				setIsProcessing(true);
				const success = await ServiceAPI.deleteChain(chain.id);

				if (!success) {
					throw new Error(`Failed to delete chain ${chain.name}`);
				}

				if (typeof onSuccess === 'function') {
					onSuccess();
				}
			}
		} catch (e: any) {
			addToast(
				<Toasts title="Error" icon="Error" iconColor="danger" isDismiss>
					{e.message}
				</Toasts>,
				{
					autoDismiss: true,
				},
			);
		}
		setIsProcessing(false);
	});

	useEffect(() => {
		console.log(formik.errors);
	}, [formik.errors]);

	return (
		<OffCanvas setOpen={setOpen} isOpen={isOpen} titleId="edit-chain" isBodyScroll placement="end">
			<OffCanvasHeader setOpen={setOpen}>
				<OffCanvasTitle id="edit-chain-title">Edit chain</OffCanvasTitle>
			</OffCanvasHeader>

			<OffCanvasBody>
				<div className="row g-4">
					<div className="col-12">
						<FormGroup id="chainId" label="Chain ID">
							<Input
								type="number"
								onChange={formik.handleChange}
								value={formik.values.chainId}
								isTouched={formik.touched.chainId}
								invalidFeedback={formik.errors.chainId}
								isValid={formik.isValid}
							/>
						</FormGroup>
					</div>
					<div className="col-12">
						<FormGroup id="name" label="Name">
							<Input
								onChange={formik.handleChange}
								value={formik.values.name}
								isTouched={formik.touched.name}
								invalidFeedback={formik.errors.name}
								isValid={formik.isValid}
							/>
						</FormGroup>
					</div>
					<div className="col-12">
						<FormGroup id="rpcUri" label="RPC">
							<Input
								onChange={formik.handleChange}
								value={formik.values.rpcUri}
								isTouched={formik.touched.rpcUri}
								invalidFeedback={formik.errors.rpcUri}
								isValid={formik.isValid}
							/>
						</FormGroup>
					</div>
					<div className="col-12">
						<FormGroup id="wsRpcUri" label="Websocket">
							<Input
								onChange={formik.handleChange}
								value={formik.values.wsRpcUri}
								isTouched={formik.touched.wsRpcUri}
								invalidFeedback={formik.errors.wsRpcUri}
								isValid={formik.isValid}
							/>
						</FormGroup>
					</div>
				</div>
			</OffCanvasBody>

			<div className="row m-0">
				<div className="col-6 p-3">
					<Button isDisable={isProcessing} color="info" className="w-100" onClick={formik.handleSubmit}>
						{isProcessing && <Spinner isSmall inButton isGrow />}
						Save
					</Button>
				</div>
				<div className="col-6 p-3">
					<Button isDisable={isProcessing} color="danger" className="w-100" onClick={deleteChain}>
						{isProcessing && <Spinner isSmall inButton isGrow />}
						Delete
					</Button>
				</div>
			</div>
		</OffCanvas>
	);
};

export default EditChainOffCanvas;
