import Button from '@/components/bootstrap/Button';
import FormGroup from '@/components/bootstrap/forms/FormGroup';
import Input from '@/components/bootstrap/forms/Input';
import OffCanvas, { OffCanvasBody, OffCanvasHeader, OffCanvasTitle } from '@/components/bootstrap/Offcanvas';
import Spinner from '@/components/bootstrap/Spinner';
import Toasts from '@/components/bootstrap/Toasts';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import ServiceAPI from '@/services/service-api';
import { TAddDEX, TDEX, TUpdateDEX } from '@/type/data/dexes.type';
import { useFormik } from 'formik';
import { isEmpty, isNil, omitBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import * as yup from 'yup';

const validate = () => {
	return yup.object().shape({
		name: yup.string().max(50).required(),
	});
};

interface FormikValues {
	name?: string;
}

interface EditDEXOffCanvasProps {
	dex?: TDEX | null;
	mode: 'add' | 'edit';
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
	onSuccess?: () => void;
}

const EditDEXOffCanvas: React.FC<EditDEXOffCanvasProps> = ({ dex, mode, isOpen, setOpen, onSuccess }) => {
	const { addToast } = useToasts();

	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const formik = useFormik<FormikValues>({
		initialValues: !dex
			? {}
			: {
					name: dex.name,
			  },
		validationSchema: validate(),
		onSubmit: async (values) => {
			try {
				setIsProcessing(true);
				const { name } = values;

				if (mode === 'edit' && !isNil(dex)) {
					const dto: TUpdateDEX = omitBy(
						{
							name: name as string,
						},
						isNil,
					) as TUpdateDEX;

					if (!isEmpty(dto)) {
						const success = await ServiceAPI.updateDex(dex.id, dto);
						if (!success) {
							throw new Error(`Failed to update dex ${dex.name}`);
						}
					}
				} else {
					// add new
					const dto: TAddDEX = omitBy(
						{
							name: name as string,
						},
						isNil,
					) as TAddDEX;

					if (!isEmpty(dto)) {
						const success = await ServiceAPI.createDex(dto);
						if (!success) {
							throw new Error(`Failed to add new dex ${name as string}`);
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

	const deleteDex = useOnEventCallback(async () => {
		try {
			if (dex?.id) {
				setIsProcessing(true);
				const success = await ServiceAPI.deleteDex(dex.id);

				if (!success) {
					throw new Error(`Failed to delete dex ${dex.name}`);
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
		<OffCanvas setOpen={setOpen} isOpen={isOpen} titleId="edit-dex" isBodyScroll placement="end">
			<OffCanvasHeader setOpen={setOpen}>
				<OffCanvasTitle id="edit-dex-title">Edit DEX</OffCanvasTitle>
			</OffCanvasHeader>

			<OffCanvasBody>
				<div className="row g-4">
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
					<Button isDisable={isProcessing} color="danger" className="w-100" onClick={deleteDex}>
						{isProcessing && <Spinner isSmall inButton isGrow />}
						Delete
					</Button>
				</div>
			</div>
		</OffCanvas>
	);
};

export default EditDEXOffCanvas;
