import { useEffect, useMemo, useState } from "react";
import {
    Typography,
    CssBaseline,
    Box,
    Grid,
    Card,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Badge,
    DialogContentText,
    IconButton,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ComputerIcon from "@mui/icons-material/Computer";
import VideocamIcon from "@mui/icons-material/Videocam";
import styled, { css } from "styled-components";
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


// --- Types ---
type DeviceType = "printer" | "pc" | "camera";

type Device = {
    id: string;
    name: string;
    ip: string;
    type: DeviceType;
    online: boolean;
};

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Main = styled.main`
  flex-grow: 1;
  padding: 24px;
  background: #f5f7fb;
  min-height: 100vh;
`;

const CardIndicator = styled.div<{ offline?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: rgba(0,0,0,0.04);
  margin-right: 12px;
  ${props =>
        props.offline &&
        css`
      box-shadow: 0 0 0 3px rgba(255,0,0,0.08) inset;
    `}
`;

const DeviceIconWrapper = styled.div<{ color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: ${p => p.color}20; /* light background */
  color: ${p => p.color};
`;

const OfflineRow = styled(TableRow).withConfig({
    shouldForwardProp: (prop) => prop !== "offline",
}) <{ offline?: boolean }>`
  ${props =>
        props.offline &&
        css`
      border-left: 4px solid rgba(255, 0, 0, 0.7);
    `}
`;


// --- Component ---
export default function App(): JSX.Element {
    const [openModal, setOpenModal] = useState(false);

    const [newDevice, setNewDevice] = useState<Omit<Device, "id" | "online">>({
        name: "",
        ip: "",
        type: "printer",
    });

    const [editDevice, setEditDevice] = useState<Device | null>(null);

    const [activeFilter, setActiveFilter] = useState<DeviceType | null>(null);

    const toggleFilter = (type: DeviceType) => {
        setActiveFilter(prev => (prev === type ? null : type));
    };

    const [openConfirm, setOpenConfirm] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);


    const [devices, setDevices] = useState<Device[]>([

        { id: "printer-1", name: "Impressora Dipron", ip: "192.168.14.15", type: "printer", online: false },
        { id: "printer-2", name: "Impressora Gore", ip: "192.168.14.16", type: "printer", online: false },
        { id: "printer-3", name: "Impressora Chefe de Equipe", ip: "192.168.14.17", type: "printer", online: false },
        { id: "printer-4", name: "Impressora PAD", ip: "192.168.14.17", type: "printer", online: false },
        { id: "printer-5", name: "Impressora Jurídico", ip: "192.168.14.17", type: "printer", online: false },
        { id: "printer-6", name: "Impressora Monitoramento", ip: "192.168.14.17", type: "printer", online: false },

        { id: "cam-1", name: "Câmera Speed 1 / DVR3", ip: "192.168.14.72", type: "camera", online: false },
        { id: "cam-2", name: "Câmera Speed 2", ip: "192.168.14.92", type: "camera", online: false },
        { id: "cam-3", name: "Câmera BD", ip: "192.168.14.76", type: "camera", online: false },
        { id: "cam-4", name: "Câmera Enfermaria 2", ip: "192.168.14.77", type: "camera", online: false },
        { id: "cam-5", name: "Câmera Lateral G", ip: "192.168.14.78", type: "camera", online: false },
        { id: "cam-6", name: "Câmera Enfermaria 1", ip: "192.168.14.79", type: "camera", online: false },
        { id: "cam-7", name: "Câmera JK", ip: "192.168.14.81", type: "camera", online: false },
        { id: "cam-8", name: "Câmera Quadra1", ip: "192.168.14.82", type: "camera", online: false },
        { id: "cam-9", name: "Câmera ALA K", ip: "192.168.14.83", type: "camera", online: false },
        { id: "cam-10", name: "Câmera CAMPO FUTEBOL", ip: "192.168.14.85", type: "camera", online: false },
        { id: "cam-11", name: "Câmera Quadra3", ip: "192.168.14.86", type: "camera", online: false },
        { id: "cam-12", name: "Câmera TRIAGEM", ip: "192.168.14.87", type: "camera", online: false },
        { id: "cam-13", name: "Câmera FH", ip: "192.168.14.88", type: "camera", online: false },
        { id: "cam-14", name: "Câmera J", ip: "192.168.14.89", type: "camera", online: false },
        { id: "cam-15", name: "Câmera IG", ip: "192.168.14.90", type: "camera", online: false },
        { id: "cam-16", name: "Câmera A", ip: "192.168.14.91", type: "camera", online: false },
        { id: "cam-17", name: "DVR 1", ip: "192.168.14.70", type: "camera", online: false },
        { id: "cam-18", name: "DVR 2", ip: "192.168.14.71", type: "camera", online: false },
        { id: "cam-19", name: "DVR 4", ip: "192.168.14.73", type: "camera", online: false },
        { id: "cam-20", name: "DVR 5", ip: "192.168.14.74", type: "camera", online: false },
        { id: "cam-21", name: "DVR 6", ip: "192.168.14.75", type: "camera", online: false },
        { id: "cam-22", name: "Joystick speeds", ip: "192.168.14.110", type: "camera", online: false },

        { id: "pc-1", name: "PC Servidor", ip: "192.168.14.1", type: "pc", online: false },
        { id: "pc-2", name: "PC Arquivos", ip: "192.168.14.3", type: "pc", online: false },
        { id: "pc-3", name: "N-Sala01", ip: "192.168.14.8", type: "pc", online: false },
        { id: "pc-4", name: "N-Sala02", ip: "192.168.14.9", type: "pc", online: false },
        { id: "pc-5", name: "N-Sala03", ip: "192.168.14.10", type: "pc", online: false },
        { id: "pc-6", name: "N-Sala04", ip: "192.168.14.11", type: "pc", online: false },
        { id: "pc-7", name: "N-Sala05", ip: "192.168.14.12", type: "pc", online: false },
        { id: "pc-8", name: "N-Sala06", ip: "192.168.14.13", type: "pc", online: false },
        { id: "pc-9", name: "N-Sala07", ip: "192.168.14.14", type: "pc", online: false },
        { id: "pc-10", name: "OAB-PARLATORIO", ip: "192.168.14.44", type: "pc", online: false },
        { id: "pc-11", name: "N-87675/EAD", ip: "192.168.14.50", type: "pc", online: false },
        { id: "pc-12", name: "N-87674/EAD", ip: "192.168.14.51", type: "pc", online: false },
        { id: "pc-13", name: "N-87681/EAD", ip: "192.168.14.52", type: "pc", online: false },
        { id: "pc-14", name: "N-87683/EAD", ip: "192.168.14.53", type: "pc", online: false },
        { id: "pc-15", name: "N-87680/EAD", ip: "192.168.14.54", type: "pc", online: false },
        { id: "pc-16", name: "N-87682/EAD", ip: "192.168.14.55", type: "pc", online: false },
        { id: "pc-17", name: "N-87677/EAD", ip: "192.168.14.56", type: "pc", online: false },
        { id: "pc-18", name: "N-87679/EAD", ip: "192.168.14.57", type: "pc", online: false },
        { id: "pc-19", name: "N-87678/EAD", ip: "192.168.14.58", type: "pc", online: false },
        { id: "pc-20", name: "N-87676/EAD", ip: "192.168.14.59", type: "pc", online: false },
        { id: "pc-21", name: "PC Sivic", ip: "192.168.14.80", type: "pc", online: false },
        { id: "pc-22", name: "PC Ponto", ip: "192.168.14.99", type: "pc", online: false },
        { id: "pc-23", name: "PC Psicologa / E-023916", ip: "192.168.14.102", type: "pc", online: false },
        { id: "pc-24", name: "PC VIDEOCONFERENCIA / DESKTOP-PVF9FV1", ip: "192.168.14.103", type: "pc", online: false },
        { id: "pc-25", name: "PC PAD1 / E-056559", ip: "192.168.14.116", type: "pc", online: false },
        { id: "pc-26", name: "PC PAD2 / E-056609", ip: "192.168.14.143", type: "pc", online: false },
        { id: "pc-27", name: "PC Q1 / E-056606", ip: "192.168.14.161", type: "pc", online: false },
        { id: "pc-28", name: "PC Diretor adjunto / E-056598", ip: "192.168.14.167", type: "pc", online: false },
        { id: "pc-29", name: "PC Q1 / E-003143", ip: "192.168.14.172", type: "pc", online: false },
        { id: "pc-30", name: "PC Gore / 70:85:C2:87:E9:66", ip: "192.168.14.174", type: "pc", online: false },
        { id: "pc-31", name: "PC Paiol / 00:1C:25:DF:54:AC", ip: "192.168.14.205", type: "pc", online: false },
        { id: "pc-32", name: "PC Juridico / 70:85:C2:87:F0:8F", ip: "192.168.14.207", type: "pc", online: false },
        { id: "pc-33", name: "PC Diretora / E-056650", ip: "192.168.14.210", type: "pc", online: false },
        { id: "pc-34", name: "PC Juridico / E-056619", ip: "192.168.14.211", type: "pc", online: false },
        { id: "pc-35", name: "PC Q1 / E-075540", ip: "192.168.14.218", type: "pc", online: false },
        { id: "pc-36", name: "PC Social / E-023900", ip: "192.168.14.219", type: "pc", online: false },
        { id: "pc-37", name: "PC Enfermagem / D-020853", ip: "192.168.14.220", type: "pc", online: false },
        { id: "pc-38", name: "PC Juridico / E-056640", ip: "192.168.14.222", type: "pc", online: false },
        { id: "pc-39", name: "PC Recepcao / 70:85:C2:87:EB:98", ip: "192.168.14.224", type: "pc", online: false },
        { id: "pc-40", name: "PC Social / E-0563684", ip: "192.168.14.228", type: "pc", online: false },
        { id: "pc-41", name: "PC Medico / 18:C0:4D:F1:25:4F", ip: "192.168.14.230", type: "pc", online: false },
        { id: "pc-42", name: "PC Social / E-026837", ip: "192.168.14.236", type: "pc", online: false },
        { id: "pc-43", name: "PC Q2 / E-075505", ip: "192.168.14.237", type: "pc", online: false },
        { id: "pc-44", name: "PC Priscila / DESKTOP-BITF2TS", ip: "192.168.14.240", type: "pc", online: false },
        { id: "pc-45", name: "PC SOCIAL / 00:24:7E:46:B3:4D", ip: "192.168.14.241", type: "pc", online: false },
        { id: "pc-46", name: "PC Nuint / DESKTOP-2VBJKHL", ip: "192.168.14.246", type: "pc", online: false },
        { id: "pc-47", name: "PC Dipron / UP-SOBRAL-PAIOL", ip: "192.168.14.248", type: "pc", online: false },
        { id: "pc-48", name: "PC Iris / 18:C0:4D:F1:32:BF", ip: "192.168.14.249", type: "pc", online: false },
        { id: "pc-49", name: "PC Gerente / 8C:0F:6F:73:1D:B5", ip: "192.168.14.252", type: "pc", online: false },
        { id: "pc-50", name: "PC Dipron", ip: "192.168.14.231", type: "pc", online: false },


    ]);


    useEffect(() => {
        const pingDevices = async () => {
            try {
                const response = await fetch("http://localhost:9007/api/ping-devices-from-db", {
                    method: "GET"
                });

                if (!response.ok) {
                    throw new Error("Erro ao contatar o backend");
                }

                const updated = await response.json();
                setDevices(updated);
            } catch (err) {
                console.error("Erro ao verificar status dos dispositivos:", err);
            }
        };

        pingDevices(); // executa ao montar

        const intervalId = setInterval(pingDevices, 10000); // repete a cada 10s

        return () => clearInterval(intervalId); // limpa o intervalo no unmount
    }, []); // ✅ sem dependências aqui

    const counts = useMemo(() => {
        const printers = devices.filter(d => d.type === "printer");
        const pcs = devices.filter(d => d.type === "pc");
        const cams = devices.filter(d => d.type === "camera");

        return {
            printersOnline: printers.filter(d => d.online).length,
            totalPrinters: printers.length,

            pcsOnline: pcs.filter(d => d.online).length,
            totalPCs: pcs.length,

            camsOnline: cams.filter(d => d.online).length,
            totalCams: cams.length,
        };
    }, [devices]);

    const handleDelete = async (id: string) => {
        await fetch(`http://localhost:9007/api/devices/${id}`, {
            method: 'DELETE',
        });
        setDevices(devices.filter(device => device.id !== id));
    };

    const handleEdit = (device: Device) => {
        setEditDevice(device);
    };

    const handleEditSave = async () => {
        if (!editDevice) return;
        const res = await fetch(`http://localhost:9007/api/devices/${editDevice.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editDevice),
        });
        const updated = await res.json();
        setDevices(devices.map(d => d.id === updated.id ? updated : d));
        setEditDevice(null);
    };

    const handleOpenConfirm = (device: Device) => {
        setDeviceToDelete(device);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setDeviceToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (deviceToDelete) {
            handleDelete(deviceToDelete.id);
        }
        handleCloseConfirm();
    };

    const getIconFor = (type: DeviceType) => {
        if (type === "printer") return <PrintIcon />;
        if (type === "pc") return <ComputerIcon />;
        return <VideocamIcon />;
    };

    const colorFor = (type: DeviceType) => {
        if (type === "printer") return "#7C4DFF"; // purple
        if (type === "pc") return "#2E7D32"; // green
        return "#FB8C00"; // orange
    };

    return (
        <Root>
            <CssBaseline />

            <Main>
                <Grid container spacing={2} alignItems="stretch">
                    <Grid item xs={12} md={4}>
                        <Card
                            onClick={() => toggleFilter('printer')}
                            style={{
                                cursor: "pointer",
                                backgroundColor: activeFilter === "printer" ? "#EDE7F6" : undefined,
                            }}
                        >
                            <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                <CardIndicator>
                                    <DeviceIconWrapper color={colorFor('printer')}>{getIconFor('printer')}</DeviceIconWrapper>
                                </CardIndicator>
                                <div>
                                    <Typography variant="subtitle2">Impressoras online</Typography>
                                    <Typography variant="h5">{counts.printersOnline} / {counts.totalPrinters}</Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card
                            onClick={() => toggleFilter('pc')}
                            style={{
                                cursor: "pointer",
                                backgroundColor: activeFilter === "pc" ? "#E8F5E9" : undefined,
                            }}
                        >
                            <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                <CardIndicator>
                                    <DeviceIconWrapper color={colorFor('pc')}>{getIconFor('pc')}</DeviceIconWrapper>
                                </CardIndicator>
                                <div>
                                    <Typography variant="subtitle2">PCs online</Typography>
                                    <Typography variant="h5">{counts.pcsOnline} / {counts.totalPCs}</Typography>

                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card
                            onClick={() => toggleFilter('camera')}
                            style={{
                                cursor: "pointer",
                                backgroundColor: activeFilter === "camera" ? "#FFF3E0" : undefined,
                            }}
                        >
                            <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                                <CardIndicator>
                                    <DeviceIconWrapper color={colorFor('camera')}>{getIconFor('camera')}</DeviceIconWrapper>
                                </CardIndicator>
                                <div>
                                    <Typography variant="subtitle2">Câmeras IP online</Typography>
                                    <Typography variant="h5">{counts.camsOnline} / {counts.totalCams}</Typography>

                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Dispositivos
                                </Typography>

                                <Box sx={{ overflowX: 'auto' }}>
                                    <Table sx={{ minWidth: 650 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Ícone</TableCell>
                                                <TableCell>Nome do dispositivo</TableCell>
                                                <TableCell>Endereço IP</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Ações</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {devices
                                                .filter(device => (activeFilter ? device.type === activeFilter : true))
                                                .map(device => (
                                                    <OfflineRow key={device.id} offline={!device.online}>
                                                        <TableCell>
                                                            <DeviceIconWrapper
                                                                color={colorFor(device.type)}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => window.open(`http://${device.ip}`, '_blank')}
                                                                title={`Abrir ${device.name} (${device.ip})`}
                                                            >
                                                                {getIconFor(device.type)}
                                                            </DeviceIconWrapper>
                                                        </TableCell>
                                                        <TableCell>{device.name}</TableCell>
                                                        <TableCell>{device.ip}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                badgeContent={device.online ? 'Online' : 'Offline'}
                                                                color={device.online ? 'success' : 'error'}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton aria-label="editar" onClick={() => handleEdit(device)} size="small">
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                aria-label="excluir"
                                                                onClick={() => handleOpenConfirm(device)}
                                                                size="small"
                                                                color="error"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </OfflineRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    {/* Diálogo de Edição */}
                                    <Dialog open={!!editDevice} onClose={() => setEditDevice(null)}>
                                        <DialogTitle>Editar Dispositivo</DialogTitle>
                                        <DialogContent>
                                            <TextField
                                                margin="dense"
                                                label="Nome"
                                                fullWidth
                                                value={editDevice?.name || ''}
                                                onChange={(e) => setEditDevice(prev => prev ? { ...prev, name: e.target.value } : null)}
                                            />
                                            <TextField
                                                margin="dense"
                                                label="IP"
                                                fullWidth
                                                value={editDevice?.ip || ''}
                                                onChange={(e) => setEditDevice(prev => prev ? { ...prev, ip: e.target.value } : null)}
                                            />
                                            <TextField
                                                margin="dense"
                                                label="Tipo"
                                                fullWidth
                                                value={editDevice?.type || ''}
                                                onChange={(e) =>
                                                    setEditDevice(prev => prev ? { ...prev, type: e.target.value as Device['type'] } : null)
                                                }

                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setEditDevice(null)}>Cancelar</Button>
                                            <Button onClick={handleEditSave} color="primary">Salvar</Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                                        <DialogTitle>Confirmação</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Tem certeza que deseja excluir o dispositivo{' '}
                                                <strong>{deviceToDelete?.name}</strong>?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseConfirm}>Cancelar</Button>
                                            <Button onClick={handleConfirmDelete} color="error" variant="contained">
                                                Excluir
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Main>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Adicionar Novo Dispositivo</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Nome"
                        fullWidth
                        margin="dense"
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    />
                    <TextField
                        label="Endereço IP"
                        fullWidth
                        margin="dense"
                        value={newDevice.ip}
                        onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                    />
                    <TextField
                        label="Tipo"
                        select
                        fullWidth
                        margin="dense"
                        value={newDevice.type}
                        onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value as DeviceType })}
                    >
                        <MenuItem value="printer">Impressora</MenuItem>
                        <MenuItem value="pc">PC</MenuItem>
                        <MenuItem value="camera">Câmera</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            const deviceToSend = {
                                ...newDevice,
                                id: `${newDevice.type}-${Date.now()}`, // gera ID simples
                                online: false,
                            };

                            try {
                                const res = await fetch("http://localhost:9007/api/add-device", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(deviceToSend),
                                });

                                if (!res.ok) throw new Error("Erro ao adicionar");

                                setDevices(prev => [...prev, deviceToSend]);
                                setOpenModal(false);
                                setNewDevice({ name: "", ip: "", type: "printer" });

                            } catch (err) {
                                console.error("Erro ao adicionar dispositivo:", err);
                            }
                        }}
                    >
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>
            <Fab
                color="primary"
                aria-label="add"
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                }}
                onClick={() => setOpenModal(true)}
            >
                <AddIcon />
            </Fab>

        </Root>
    );
}
