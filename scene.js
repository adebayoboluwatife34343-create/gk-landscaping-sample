
export function build(THREE,ctx){
 const {scene,camera,state:st}=ctx;
 camera.position.set(0,2.9,13.5);camera.lookAt(0,1.6,0);
 scene.add(new THREE.HemisphereLight(0xfff4d8,0x24331f,1.7));const key=new THREE.DirectionalLight(0xffe6b0,3.2);key.position.set(4,8,6);scene.add(key);const rim=new THREE.DirectionalLight(0x9fd070,1.2);rim.position.set(-5,3,-4);scene.add(rim);
 const root=new THREE.Group();scene.add(root);
 const pts=[[0,-1.3],[.95,-1.3],[1.0,-.9],[1.15,0],[1.3,.55],[1.42,.58],[1.42,.8],[1.28,.82],[1.25,.66]].map(p=>new THREE.Vector2(p[0]*.95,p[1]));
 const pot=new THREE.Mesh(new THREE.LatheGeometry(pts,48),new THREE.MeshStandardMaterial({color:0xb85a30,roughness:.85,side:THREE.DoubleSide}));pot.position.y=-.1;root.add(pot);
 const soil=new THREE.Mesh(new THREE.CircleGeometry(1.22,40),new THREE.MeshStandardMaterial({color:0x2b1c14,roughness:1}));soil.rotation.x=-Math.PI/2;soil.position.y=.6;root.add(soil);
 const saucer=new THREE.Mesh(new THREE.CylinderGeometry(1.35,1.1,.12,40),new THREE.MeshStandardMaterial({color:0x9a4a28,roughness:.9}));saucer.position.y=-1.45;root.add(saucer);
 const stemM=new THREE.MeshStandardMaterial({color:0x4a6e2a,roughness:.8});const leafG=new THREE.SphereGeometry(1,12,8);
 const lm=[0x5e8a34,0x4a7a2e,0x7da144,0x3f6b2a].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.7,side:THREE.DoubleSide}));
 const petalC=[0xc9902f,0x7a1f26,0xf0e2c0,0xc0643a];const stems=[];
 for(let i=0;i<16;i++){
  const a=i/16*Math.PI*2+Math.random()*.4,R=.3+Math.random()*1.2,H=1.5+Math.random()*1.6;
  const end=new THREE.Vector3(Math.cos(a)*R,H,Math.sin(a)*R),ctrl=new THREE.Vector3(Math.cos(a)*R*.25,H*.6,Math.sin(a)*R*.25);
  const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(0,0,0),ctrl,end);
  const grp=new THREE.Group();grp.position.set(Math.cos(a)*.25,.6,Math.sin(a)*.25);root.add(grp);
  grp.add(new THREE.Mesh(new THREE.TubeGeometry(curve,14,.035,6),stemM));
  for(let k=0;k<7;k++){const t=.2+k*.11,p=curve.getPoint(t);const l=new THREE.Mesh(leafG,lm[(i+k)%4]);l.scale.set(.32+Math.random()*.1,.04,.14);l.position.copy(p);l.rotation.set(Math.random()*.6,a+(k%2?1:-1)*1.2,(k%2?1:-1)*.5);grp.add(l)}
  const fl=new THREE.Group();fl.position.copy(end);const pc=petalC[i%4];
  for(let k=0;k<7;k++){const q=k/7*Math.PI*2;const pe=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8),new THREE.MeshStandardMaterial({color:pc,roughness:.6}));pe.scale.set(1,.5,1.5);pe.position.set(Math.cos(q)*.15,0,Math.sin(q)*.15);pe.rotation.y=-q;fl.add(pe)}
  const ce=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),new THREE.MeshStandardMaterial({color:0x3a2a14}));fl.add(ce);grp.add(fl);
  stems.push({grp,fl,delay:Math.random()*.35,ph:Math.random()*6});
 }
 const ease=t=>1-Math.pow(1-t,3);let g=0,gT=st.reduced?1:.8,user=false;const sl=document.querySelector('#val'),out=document.querySelector('#val-out');
 if(st.reduced){g=1;if(sl)sl.value=1}
 function apply(s,tt){for(const o of stems){const k=ease(Math.max(0,Math.min(1,(g-o.delay*.7)/.55)));o.grp.scale.setScalar(Math.max(.001,k));o.grp.visible=k>.01;const f=Math.max(0,Math.min(1,(g-.75)/.25));o.fl.scale.setScalar(Math.max(.001,f));o.grp.rotation.z=s.reduced?0:Math.sin(tt*1.1+o.ph)*.025-s.px*.08*k;o.grp.rotation.x=s.reduced?0:Math.cos(tt*.9+o.ph)*.02+s.py*.05*k}}
 if(sl)sl.addEventListener('input',()=>{user=true;g=parseFloat(sl.value)});
 return{onReset(){user=true;g=0;if(sl)sl.value=0},
  update(dt,s){if(!user&&!s.reduced){g+=(gT-g)*Math.min(1,dt*.7)+.0004;if(g>gT)g=gT;if(sl)sl.value=g.toFixed(2);if(out)out.textContent=Math.round(g*100)+'%'}
   apply(s,s.t);root.rotation.y=s.dragY+(s.sp-.5)*.8+s.t*(s.reduced?0:.08);root.rotation.x=s.dragX*.3;}}
}
