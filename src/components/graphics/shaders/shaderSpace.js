/* eslint-disable */
export const shaderSpace = `precision highp float;

const float pi = 3.14159265359;

uniform float iTime;
uniform vec2 iMouse;
uniform vec2 iResolution;
uniform float iAudio;


float t;
float cc,ss;

float cosPath(vec3 p, vec3 dec){return dec.x * cos(p.z * dec.y + dec.z);}
float sinPath(vec3 p, vec3 dec){return dec.x * sin(p.z * dec.y + dec.z);}

vec2 getCylinder(vec3 p, vec2 pos, float r, vec3 c, vec3 s)
{
    return p.xy - pos - vec2(cosPath(p, c), sinPath(p, s));
}
vec4 formula (vec4 p) {
    p.y-=t*.25;
    p.y=abs(3.-mod(p.y-t,6.));
    for (int i=0; i<6; i++) {
        p.xyz = abs(p.xyz)-vec3(.0,1.,.0);
        p=p*1.6/clamp(dot(p.xyz,p.xyz),.2,1.)-vec4(0.4,1.5,0.4,0.);
        p.xz*=mat2(cc,ss,-ss,cc);
    }
    return p;
}
float texture2 (vec3 p) {
    //p.xz=abs(.75-mod(p.xz,1.5));
    p=formula(vec4(p,0.)).xyz;
    return .13+clamp(pow(max(0.,1.-max(abs(p.x),abs(p.z))),2.)*2.,.1,.7);
}
/////////////////////////
// FROM Shader Cloudy spikeball from duke : https://www.shadertoy.com/view/MljXDw
float noise(vec3 p) {
    vec3 i = floor(p);
    vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
    vec3 f = cos((p-i)*pi)*(-.5) + .5;
    a = mix(sin(cos(a)*a), sin(cos(1.+a)*(1.+a)), f.x);
    a.xy = mix(a.xz, a.yw, f.y);
    return mix(a.x, a.y, f.z);
}

float fpn(vec3 p) 
{
    p += t*5.;
    return noise(p*0.02)*1.98 + noise(p*0.02)*0.62 + noise(p*0.09)*0.39;
}
/////////////////////////

float map(vec3 p)
{
    float pnNoise = fpn(p*13.)*.8;
    float path = sinPath(p ,vec3(6.2, .33, 0.));
    float bottom = p.y + pnNoise;
    float cyl = 0.;vec2 vecOld;
    for (float i=0.;i<6.;i++)
    {
        float x = 1. * i;
        float y = .88 + 0.0102*i;
        float z  = -0.02 -0.16*i;
        float r = 4.4 + 2.45 * i;
        vec2 vec = getCylinder(p, vec2(path, 3.7 * i), r , vec3(x,y,z), vec3(z,x,y));
        cyl = r - min(length(vec), length(vecOld));
        vecOld = vec;   
    }
    cyl += pnNoise;
    cyl = min(cyl, bottom);
    return cyl;
}

vec3 cam(vec2 uv, vec3 ro, vec3 cu, vec3 cv)
{
    vec3 rov = normalize(cv-ro);
    vec3 u =  normalize(cross(cu, rov));
    vec3 v =  normalize(cross(rov, u));
    float fov = 3.;
    vec3 rd = normalize(rov + fov*u*uv.x + fov*v*uv.y);
    return rd;
}

void mainImage( out vec4 f, in vec2 g )
{
    t = iTime*2.5;
    f = vec4(0,0.15,0.32,1);
    vec2 si = iResolution.xy;
    vec2 uv = (2.*g-si)/min(si.x, si.y);
    vec3 ro = vec3(0), p=ro;
    ro.y = sin(t*.2)*15.+15.;
    ro.x = sin(t*.5)*5.;
    ro.z = t*5.;
    vec3 rd = cam(uv, p, vec3(0,1,0), p + vec3(0,0,1));
    float s = 1., h = .15, td = 0., d=1.,dd=0., w;
    float var = 0.03;
    if (iMouse.y>0.) var = 0.1*iMouse.y/iResolution.y;
    for(float i=0.;i<200.;i++)
    {      
        if(s<0.01||d>500.||td>.95) break;
        s = map(p) * (s>0.001?var:.2);
        if (s < h)
        {
            w = (1.-td) * (h-s)*i/200.;
            f += w;
            td += w;
        }
        dd += 0.012;
        td += 0.005;
        s = max(s, 0.05);
        d+=s;   
        p = ro+rd*d;    
    }
    f.rgb = mix( f.rgb, vec3(0,0.15,0.52), 1.0 - exp( -0.001*d*d) )/dd; // fog
    
    // vigneting from iq Shader Mike : https://www.shadertoy.com/view/MsXGWr
    vec2 q = g/si;
    f.rgb *= 0.5 + 0.5*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.25 );
}

void main(){
  mainImage(gl_FragColor,gl_FragCoord.xy);
}`;
