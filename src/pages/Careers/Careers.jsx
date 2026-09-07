import { useEffect, useState } from "react";
import { fetchOpenRoles, fetchCareerSettings } from "../../services/careerService";
import ApplicationModal from "./ApplicationModal";

const ICON_MAP = [
  { match: /3d.*architect|3d.*visualiz.*artist/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDwhLS0gV2lyZWZyYW1lIEh1bWFuIC8gQm9keSAtLT4KICAgIDxjaXJjbGUgY3g9IjMwIiBjeT0iMjUiIHI9IjgiLz4KICAgIDxwYXRoIGQ9Ik0zMCAzMyBMMzAgNjUgTDIwIDkwIE0zMCA2NSBMNDAgOTAiLz4KICAgIDxwYXRoIGQ9Ik0zMCA0MiBMMTIgNTUgTTMwIDQyIEw1MiAzNSBMNjggMjUiLz4KICAgIDxwYXRoIGQ9Ik0yMiAyNSBMMzggMjUgTTMwIDE3IEwzMCAzMyIvPgogICAgCiAgICA8IS0tIERpZ2l0YWwgUGVuICYgQ2FudmFzIEdyaWQgLS0+CiAgICA8cGF0aCBkPSJNNjggMjUgTDY1IDE4IEw3MiAyMSBaIiBmaWxsPSIjNzBhMTNkIi8+CiAgICA8cmVjdCB4PSI1NSIgeT0iMzUiIHdpZHRoPSIzNSIgaGVpZ2h0PSIzNSIgcng9IjMiIHN0cm9rZS1kYXNoYXJyYXk9IjQgMiIvPgogICAgPGNpcmNsZSBjeD0iNTUiIGN5PSIzNSIgcj0iMyIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGNpcmNsZSBjeD0iOTAiIGN5PSIzNSIgcj0iMyIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGNpcmNsZSBjeD0iNTUiIGN5PSI3MCIgcj0iMyIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGNpcmNsZSBjeD0iOTAiIGN5PSI3MCIgcj0iMyIgZmlsbD0iIzcwYTEzZCIvPgogICAgPCEtLSAzRCBDdWJlIGluc2lkZSBjYW52YXMgLS0+CiAgICA8cGF0aCBkPSJNNzIgNDMgTDgyIDQ4IEw4MiA2MCBMNzIgNTUgWiIvPgogICAgPHBhdGggZD0iTTcyIDQzIEw2MiA0OCBMNjIgNjAgTDcyIDU1IFoiLz4KICAgIDxwYXRoIGQ9Ik03MiA0MyBMODIgMzggTDcyIDMzIEw2MiAzOCBaIi8+CiAgPC9nPgo8L3N2Zz4=" },
  { match: /3d.*design|3d.*visualiz.*manager/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDwhLS0gR2VhciAvIEhlYWQgb3V0bGluZSB0b3AgLS0+CiAgICA8cGF0aCBkPSJNNTAgMTIgTDUyIDE2IEExOCAxOCAwIDAgMSA1OCAxOCBMNjIgMTYgTDY1IDIwIEw2MiAyMyBBMTggMTggMCAwIDEgNjQgMjkgTDY4IDMwIEw2NyAzNSBMNjMgMzYgQTE4IDE4IDAgMCAxIDYxIDQxIEw2MyA0NSBMNTkgNDggTDU2IDQ1IEExOCAxOCAwIDAgMSA1MCA0NiBBMTggMTggMCAwIDEgNDQgNDUgTDQxIDQ4IEwzNyA0NSBMMzkgNDEgQTE4IDE4IDAgMCAxIDM3IDM2IEwzMyAzNSBMMzIgMzAgTDM2IDI5IEExOCAxOCAwIDAgMSAzOCAyMyBMMzUgMjAgTDM4IDE2IEw0MiAxOCBBMTggMTggMCAwIDEgNDggMTYgWiIvPgogICAgPGNpcmNsZSBjeD0iNTAiIGN5PSIzMSIgcj0iNyIvPgogICAgCiAgICA8IS0tIEhpZXJhcmNoeSBsaW5lcyAtLT4KICAgIDxwYXRoIGQ9Ik01MCA0NiBMNTAgNjAgTTI1IDYwIEw3NSA2MCBNMjUgNjAgTDI1IDY4IE01MCA2MCBMNTAgNjggTTc1IDYwIEw3NSA2OCIvPgogICAgCiAgICA8IS0tIEN1YmUgMSAoTGVmdCkgLS0+CiAgICA8cGF0aCBkPSJNMjUgNjggTDMzIDcyIEwzMyA4MiBMMjUgNzggTDE3IDgyIEwxNyA3MiBaIi8+CiAgICA8cGF0aCBkPSJNMjUgNjggTDE3IDcyIE0yNSA3OCBMMjUgNjggTTI1IDc4IEwzMyA3MiIvPgogICAgCiAgICA8IS0tIEN1YmUgMiAoQ2VudGVyKSAtLT4KICAgIDxwYXRoIGQ9Ik01MCA2OCBMNTggNzIgTDU4IDgyIEw1MCA3OCBMNDIgODIgTDQyIDcyIFoiLz4KICAgIDxwYXRoIGQ9Ik01MCA2OCBMNDIgNzIgTTUwIDc4IEw1MCA2OCBNNTAgNzggTDU4IDcyIi8+CiAgICAKICAgIDwhLS0gQ3ViZSAzIChSaWdodCAtIFdpcmVmcmFtZSkgLS0+CiAgICA8cGF0aCBkPSJNNzUgNjggTDgzIDcyIEw4MyA4MiBMNzUgNzggTDY3IDgyIEw2NyA3MiBaIi8+CiAgICA8cGF0aCBkPSJNNzUgNjggTDY3IDcyIE03NSA3OCBMNzUgNjggTTc1IDc4IEw4MyA3MiIvPgogICAgPGNpcmNsZSBjeD0iNzUiIGN5PSI2OCIgcj0iMiIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGNpcmNsZSBjeD0iODMiIGN5PSI3MiIgcj0iMiIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGNpcmNsZSBjeD0iNjciIGN5PSI3MiIgcj0iMiIgZmlsbD0iIzcwYTEzZCIvPgogIDwvZz4KPC9zdmc+" },
  { match: /project.*manager/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDwhLS0gRGFzaGJvYXJkIC8gR2FudHQgV2luZG93IC0tPgogICAgPHJlY3QgeD0iMTIiIHk9IjE4IiB3aWR0aD0iNTYiIGhlaWdodD0iNDIiIHJ4PSI0Ii8+CiAgICA8bGluZSB4MT0iMTIiIHkxPSIyOCIgeDI9IjY4IiB5Mj0iMjgiLz4KICAgIDxjaXJjbGUgY3g9IjE4IiBjeT0iMjMiIHI9IjEuNSIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGNpcmNsZSBjeD0iMjMiIGN5PSIyMyIgcj0iMS41IiBmaWxsPSIjNzBhMTNkIi8+CiAgICA8Y2lyY2xlIGN4PSIyOCIgY3k9IjIzIiByPSIxLjUiIGZpbGw9IiM3MGExM2QiLz4KICAgIAogICAgPCEtLSBHYW50dCBCYXJzIC0tPgogICAgPHJlY3QgeD0iMTgiIHk9IjM0IiB3aWR0aD0iMTgiIGhlaWdodD0iNCIgcng9IjIiIGZpbGw9IiM3MGExM2QiLz4KICAgIDxyZWN0IHg9IjMyIiB5PSI0MiIgd2lkdGg9IjIyIiBoZWlnaHQ9IjQiIHJ4PSIyIiBmaWxsPSIjNzBhMTNkIi8+CiAgICA8cmVjdCB4PSI0MiIgeT0iNTAiIHdpZHRoPSIxNiIgaGVpZ2h0PSI0IiByeD0iMiIgZmlsbD0iIzcwYTEzZCIvPgogICAgCiAgICA8IS0tIENoZWNrbWFyayBDaXJjbGUgLS0+CiAgICA8Y2lyY2xlIGN4PSI3NiIgY3k9IjI4IiByPSIxMiIvPgogICAgPHBhdGggZD0iTTcwIDI4IEw3NCAzMiBMODIgMjMiLz4KICAgIAogICAgPCEtLSBNYW5hZ2VyIFVzZXIgQXZhdGFyIC0tPgogICAgPGNpcmNsZSBjeD0iNzYiIGN5PSI1OCIgcj0iOCIvPgogICAgPHBhdGggZD0iTTYwIDgyIEM2MCA3MiwgNjggNzAsIDc2IDcwIEM4NCA3MCwgOTIgNzIsIDkyIDgyIi8+CiAgICA8cGF0aCBkPSJNNzYgNjYgTDc2IDc2IE03MyA3MiBMNzkgNzIiLz4gPCEtLSBUaWUgZGV0YWlsIC0tPgogIDwvZz4KPC9zdmc+" },
  { match: /business|sales|development/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDwhLS0gTmV0d29yayBOb2RlcyAoVG9wIExlZnQpIC0tPgogICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyNSIgcj0iNCIvPgogICAgPGNpcmNsZSBjeD0iNDAiIGN5PSIxOCIgcj0iNCIvPgogICAgPGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iNCIvPgogICAgPGxpbmUgeDE9IjIwIiB5MT0iMjUiIHgyPSI0MCIgeTI9IjE4Ii8+CiAgICA8bGluZSB4MT0iNDAiIHkxPSIxOCIgeDI9IjUwIiB5Mj0iMzUiLz4KICAgIDxsaW5lIHgxPSIyMCIgeTE9IjI1IiB4Mj0iNTAiIHkyPSIzNSIvPgogICAgPGxpbmUgeDE9IjUwIiB5MT0iMzUiIHgyPSI2MCIgeTI9IjUwIi8+CgogICAgPCEtLSBHcm93dGggQXJyb3cgKFRvcCBSaWdodCkgLS0+CiAgICA8cGF0aCBkPSJNNzAgNDIgTDgyIDIyIE04MiAyMiBMNzAgMjIgTTgyIDIyIEw4MiAzNCIvPgoKICAgIDwhLS0gSGFuZHNoYWtlIC0tPgogICAgPCEtLSBMZWZ0IEFybS9IYW5kIC0tPgogICAgPHBhdGggZD0iTTE1IDY4IEwzMiA1OCBMNDIgNjYgTDM0IDc2IEwyNCA3MCBMMTUgNzgiLz4KICAgIDwhLS0gUmlnaHQgQXJtL0hhbmQgLS0+CiAgICA8cGF0aCBkPSJNODUgNjggTDY4IDU4IEw1OCA2NiBMNjYgNzYgTDc2IDcwIEw4NSA3OCIvPgogICAgPCEtLSBDbGFzcCAtLT4KICAgIDxwYXRoIGQ9Ik00MiA2NiBMNTAgNTggTDU4IDY2IEw1MCA3NCBaIi8+CiAgICA8cGF0aCBkPSJNNDUgNzEgTDQ5IDc1IE00MCA2OCBMNDUgNzMiLz4KICA8L2c+Cjwvc3ZnPg==" },
  { match: /photo/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDwhLS0gTWFpbiBDYW1lcmEgLS0+CiAgICA8cmVjdCB4PSIxMiIgeT0iMzIiIHdpZHRoPSI0NSIgaGVpZ2h0PSIzMiIgcng9IjQiLz4KICAgIDxwYXRoIGQ9Ik0yMiAzMiBMMjYgMjQgTDQyIDI0IEw0NiAzMiBaIi8+CiAgICA8Y2lyY2xlIGN4PSIzNC41IiBjeT0iNDgiIHI9IjEwIi8+CiAgICA8Y2lyY2xlIGN4PSIzNC41IiBjeT0iNDgiIHI9IjUiLz4KICAgIDxjaXJjbGUgY3g9IjQ4IiBjeT0iMzgiIHI9IjIiIGZpbGw9IiM3MGExM2QiLz4KCiAgICA8IS0tIFRyaXBvZCBDYW1lcmEgLS0+CiAgICA8cmVjdCB4PSI2MiIgeT0iMjQiIHdpZHRoPSIyNiIgaGVpZ2h0PSIxOCIgcng9IjIiLz4KICAgIDxwYXRoIGQ9Ik02OCAyNCBMNzEgMTkgTDc5IDE5IEw4MiAyNCBaIi8+CiAgICA8Y2lyY2xlIGN4PSI3NSIgY3k9IjMzIiByPSI1Ii8+CiAgICAKICAgIDwhLS0gVHJpcG9kIE1vdW50ICYgTGVncyAtLT4KICAgIDxsaW5lIHgxPSI3NSIgeTE9IjQyIiB4Mj0iNzUiIHkyPSI0OCIvPgogICAgPGxpbmUgeDE9IjY4IiB5MT0iNDgiIHgyPSI4MiIgeTI9IjQ4Ii8+CiAgICA8bGluZSB4MT0iNzUiIHkxPSI0OCIgeDI9IjU4IiB5Mj0iODUiLz4KICAgIDxsaW5lIHgxPSI3NSIgeTE9IjQ4IiB4Mj0iNzUiIHkyPSI4NSIvPgogICAgPGxpbmUgeDE9Ijc1IiB5MT0iNDgiIHgyPSI5MiIgeTI9Ijg1Ii8+CiAgICA8bGluZSB4MT0iNjMiIHkxPSI2OCIgeDI9Ijg3IiB5Mj0iNjgiLz4KICA8L2c+Cjwvc3ZnPg==" },
  { match: /video/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDwhLS0gRmlsbSBSZWVsIC0tPgogICAgPGNpcmNsZSBjeD0iNDIiIGN5PSI0NSIgcj0iMjgiLz4KICAgIDxjaXJjbGUgY3g9IjQyIiBjeT0iNDUiIHI9IjgiLz4KICAgIDxjaXJjbGUgY3g9IjQyIiBjeT0iMjciIHI9IjUiLz4KICAgIDxjaXJjbGUgY3g9IjU4IiBjeT0iNDIiIHI9IjUiLz4KICAgIDxjaXJjbGUgY3g9IjQyIiBjeT0iNjMiIHI9IjUiLz4KICAgIDxjaXJjbGUgY3g9IjI2IiBjeT0iNDgiIHI9IjUiLz4KCiAgICA8IS0tIFBsYXkgQnV0dG9uIE92ZXJsYXkgLS0+CiAgICA8Y2lyY2xlIGN4PSI2OCIgY3k9IjY1IiByPSIxNCIgZmlsbD0iIzBkMTExNyIvPgogICAgPGNpcmNsZSBjeD0iNjgiIGN5PSI2NSIgcj0iMTQiLz4KICAgIDxwb2x5Z29uIHBvaW50cz0iNjQsNTcgNzYsNjUgNjQsNzMiIGZpbGw9IiM3MGExM2QiLz4KCiAgICA8IS0tIEF1ZGlvIFdhdmVmb3JtIC0tPgogICAgPHBhdGggZD0iTTc4IDMwIEw3OCA0MiBNODMgMjQgTDgzIDQ4IE04OCAzMiBMODggNDAgTTkzIDI4IEw5MyA0NCIvPgogIDwvZz4KPC9zdmc+" },
  { match: /web|develop/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDwhLS0gQnJvd3NlciBXaW5kb3cgRnJhbWUgLS0+CiAgICA8cmVjdCB4PSIxNSIgeT0iMjAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI2MCIgcng9IjYiLz4KICAgIDxsaW5lIHgxPSIxNSIgeTE9IjM0IiB4Mj0iODUiIHkyPSIzNCIvPgogICAgPGNpcmNsZSBjeD0iMjMiIGN5PSIyNyIgcj0iMiIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGNpcmNsZSBjeD0iMzAiIGN5PSIyNyIgcj0iMiIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGNpcmNsZSBjeD0iMzciIGN5PSIyNyIgcj0iMiIgZmlsbD0iIzcwYTEzZCIvPgoKICAgIDwhLS0gQ29kZSBTeW1ib2xzOiB7IH0gLyA+IC0tPgogICAgPCEtLSBMZWZ0IEJyYWNlIHsgLS0+CiAgICA8cGF0aCBkPSJNMzAgNDYgQzI0IDQ2IDI1IDUyIDIyIDU0IEMyNSA1NiAyNCA2MiAzMCA2MiIvPgogICAgCiAgICA8IS0tIFNsYXNoIC8gLS0+CiAgICA8bGluZSB4MT0iNTMiIHkxPSI0NCIgeDI9IjQzIiB5Mj0iNjQiLz4KCiAgICA8IS0tIFJpZ2h0IEFuZ2xlIEJyYWNrZXQgPiAtLT4KICAgIDxwYXRoIGQ9Ik02MCA0NiBMNzAgNTQgTDYwIDYyIi8+CiAgPC9nPgo8L3N2Zz4=" },
  { match: /graphic|ui|visual.*design/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDwhLS0gUGFpbnRicnVzaCAvIFBlbiBUb29sIChMZWZ0KSAtLT4KICAgIDxwYXRoIGQ9Ik0yMiA3OCBMMjYgNTAgTDM0IDQ0IEwzOCA1MiBMMzIgNjAgWiIvPgogICAgPHBhdGggZD0iTTIyIDc4IEMyMCA4NCAxNiA4NiAxNiA4NiBDMTYgODYgMjIgODQgMjYgNzggWiIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGxpbmUgeDE9IjMyIiB5MT0iNDgiIHgyPSIyOCIgeTI9IjU0Ii8+CgogICAgPCEtLSBXaXJlZnJhbWUgQXJ0Ym9hcmQgLyBHcmlkIChSaWdodCkgLS0+CiAgICA8cmVjdCB4PSI0MiIgeT0iMTgiIHdpZHRoPSI0NCIgaGVpZ2h0PSI2NCIgcng9IjQiLz4KICAgIDwhLS0gVG9wIEhlYWRlciBibG9jayAtLT4KICAgIDxsaW5lIHgxPSI0MiIgeTE9IjMyIiB4Mj0iODYiIHkyPSIzMiIvPgogICAgPGxpbmUgeDE9IjQ4IiB5MT0iMjUiIHgyPSI2NSIgeTI9IjI1Ii8+CiAgICAKICAgIDwhLS0gVUkgQ2FyZHMgLyBCb3hlcyAtLT4KICAgIDxyZWN0IHg9IjQ4IiB5PSIzOCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjEyIiByeD0iMSIvPgogICAgPGxpbmUgeDE9IjQ4IiB5MT0iMzgiIHgyPSI2MyIgeTI9IjUwIi8+CiAgICA8bGluZSB4MT0iNjMiIHkxPSIzOCIgeDI9IjQ4IiB5Mj0iNTAiLz4KCiAgICA8cmVjdCB4PSI2NyIgeT0iMzgiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxMiIgcng9IjEiLz4KICAgIDxsaW5lIHgxPSI2NyIgeTE9IjM4IiB4Mj0iODIiIHkyPSI1MCIvPgogICAgPGxpbmUgeDE9IjgyIiB5MT0iMzgiIHgyPSI2NyIgeTI9IjUwIi8+CgogICAgPCEtLSBUZXh0IExpbmVzIC0tPgogICAgPGxpbmUgeDE9IjQ4IiB5MT0iNTgiIHgyPSI4MiIgeTI9IjU4Ii8+CiAgICA8bGluZSB4MT0iNDgiIHkxPSI2NCIgeDI9Ijc2IiB5Mj0iNjQiLz4KICAgIDxsaW5lIHgxPSI0OCIgeTE9IjcwIiB4Mj0iODIiIHkyPSI3MCIvPgogICAgPGxpbmUgeDE9IjQ4IiB5MT0iNzYiIHgyPSI2OCIgeTI9Ijc2Ii8+CiAgPC9nPgo8L3N2Zz4=" },
  { match: /social|media/i, icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCI+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzBhMTNkIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDwhLS0gTWVnYXBob25lIC8gTG91ZHNwZWFrZXIgLS0+CiAgICA8cGF0aCBkPSJNMTUgNDIgTDI4IDQyIEw0OCAyNiBMNDggNjggTDI4IDUyIEwxNSA1MiBaIi8+CiAgICA8cGF0aCBkPSJNMjIgNTIgTDI2IDY4IEwzNCA2OCBMMzAgNTIiLz4KICAgIDxwYXRoIGQ9Ik01MiAzNCBDNTYgMzggNTYgNTYgNTIgNjAiLz4KCiAgICA8IS0tIFJhZGlhdGluZyBTb2NpYWwgSWNvbnMgQnViYmxlcyAtLT4KICAgIDwhLS0gQ29ubmVjdGlvbiBMaW5lcyAtLT4KICAgIDxsaW5lIHgxPSI1MiIgeTE9IjQ3IiB4Mj0iNzIiIHkyPSIyNCIvPgogICAgPGxpbmUgeDE9IjU0IiB5MT0iNDciIHgyPSI4MCIgeTI9IjQ3Ii8+CiAgICA8bGluZSB4MT0iNTIiIHkxPSI0NyIgeDI9IjcyIiB5Mj0iNzAiLz4KCiAgICA8IS0tIFRvcCBCdWJibGUgKFZpZGVvIC8gWW91VHViZSBwbGF5KSAtLT4KICAgIDxjaXJjbGUgY3g9Ijc2IiBjeT0iMjAiIHI9IjkiIGZpbGw9IiMwZDExMTciLz4KICAgIDxjaXJjbGUgY3g9Ijc2IiBjeT0iMjAiIHI9IjkiLz4KICAgIDxwb2x5Z29uIHBvaW50cz0iNzQsMTYgODAsMjAgNzQsMjQiIGZpbGw9IiM3MGExM2QiLz4KCiAgICA8IS0tIE1pZGRsZSBCdWJibGUgKENhbWVyYSAvIEluc3RhZ3JhbSkgLS0+CiAgICA8Y2lyY2xlIGN4PSI4NSIgY3k9IjQ3IiByPSI5IiBmaWxsPSIjMGQxMTE3Ii8+CiAgICA8Y2lyY2xlIGN4PSI4NSIgY3k9IjQ3IiByPSI5Ii8+CiAgICA8cmVjdCB4PSI4MSIgeT0iNDMiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHJ4PSIyIi8+CiAgICA8Y2lyY2xlIGN4PSI4NSIgY3k9IjQ3IiByPSIyIi8+CgogICAgPCEtLSBCb3R0b20gQnViYmxlIChTaGFyZSAvIE5ldHdvcmspIC0tPgogICAgPGNpcmNsZSBjeD0iNzYiIGN5PSI3NCIgcj0iOSIgZmlsbD0iIzBkMTExNyIvPgogICAgPGNpcmNsZSBjeD0iNzYiIGN5PSI3NCIgcj0iOSIvPgogICAgPGNpcmNsZSBjeD0iNzMiIGN5PSI3NCIgcj0iMS41IiBmaWxsPSIjNzBhMTNkIi8+CiAgICA8Y2lyY2xlIGN4PSI3OCIgY3k9IjcxIiByPSIxLjUiIGZpbGw9IiM3MGExM2QiLz4KICAgIDxjaXJjbGUgY3g9Ijc4IiBjeT0iNzciIHI9IjEuNSIgZmlsbD0iIzcwYTEzZCIvPgogICAgPGxpbmUgeDE9IjczIiB5MT0iNzQiIHgyPSI3OCIgeTI9IjcxIi8+CiAgICA8bGluZSB4MT0iNzMiIHkxPSI3NCIgeDI9Ijc4IiB5Mj0iNzciLz4KICA8L2c+Cjwvc3ZnPg==" },
];

const getIcon = (title = "") => {
  const found = ICON_MAP.find((f) => f.match.test(title));
  return found ? found.icon : ICON_MAP[0].icon;
};

const Careers = () => {
  const [roles, setRoles] = useState([]);
  const [settings, setSettings] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [preselectedRoleId, setPreselectedRoleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOpenRoles(), fetchCareerSettings()])
      .then(([rolesData, settingsData]) => {
        setRoles(rolesData);
        setSettings(settingsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openApplyModal = (roleId = null) => {
    setPreselectedRoleId(roleId);
    setShowModal(true);
  };

  return (
    <div className="w-full bg-[#0a0a0a] text-white py-12 px-4 sm:px-8 lg:px-[10vw]">
      <div className="relative max-w-3xl mx-auto py-8 sm:py-11 px-5 sm:px-8">
        <span className="absolute top-0 left-0 w-8 h-8 sm:w-9 sm:h-9 border-t-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute top-0 right-0 w-8 h-8 sm:w-9 sm:h-9 border-t-2 border-r-2 border-[#86BA3A]"></span>
        <span className="absolute bottom-0 left-0 w-8 h-8 sm:w-9 sm:h-9 border-b-2 border-l-2 border-[#86BA3A]"></span>
        <span className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 border-b-2 border-r-2 border-[#86BA3A]"></span>

        <div className="text-center pb-9 sm:pb-11">
          <p className="uppercase tracking-[0.3em] text-[10px] sm:text-xs text-[#86BA3A] mb-5 font-mono">
            {roles.length || 9} positions open
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-[1.2] tracking-tight max-w-xl mx-auto">
            {settings?.tagline || "Join the team that makes spaces convincing before anyone steps inside"}
          </h1>
          <p className="mt-4 text-gray-400 text-sm font-light max-w-md mx-auto leading-relaxed">
            {settings?.subline || "360EYE specializes in immersive virtual tours, 3D visualization, and real estate marketing technology."}
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-sm">Loading roles...</p>
        ) : roles.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No open roles right now. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            {roles.map((role, i) => (
              <button
                key={role._id}
                onClick={() => openApplyModal(role._id)}
                className="text-left rounded-lg overflow-hidden relative bg-[#111] border border-[#232320] hover:border-[#86BA3A] transition-colors aspect-square flex flex-col items-center justify-center p-3 group"
              >
                <span className="absolute top-2 left-2 font-mono text-[9px] text-[#3a3a36]">{(i + 1).toString().padStart(2, "0")}</span>
                <img
                  src={role.iconUrl || getIcon(role.title)}
                  alt=""
                  className="w-10 h-10 sm:w-12 sm:h-12 mb-2.5 opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <p className="text-[11px] sm:text-[12px] font-semibold leading-tight text-center group-hover:text-[#86BA3A] transition-colors">
                  {role.title}
                </p>
              </button>
            ))}
          </div>
        )}

        <div className="text-center pt-9 sm:pt-11">
          <button
            onClick={() => openApplyModal(null)}
            className="w-full sm:w-auto bg-[#86BA3A] text-black px-9 py-3 font-mono uppercase text-xs sm:text-[13px] tracking-widest rounded-sm font-semibold hover:bg-[#75a52f] transition-colors"
          >
            Apply now
          </button>
        </div>
      </div>

      {showModal && (
        <ApplicationModal
          roles={roles}
          preselectedRoleId={preselectedRoleId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Careers;
